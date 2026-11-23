import math

import pytest
from fastapi.testclient import TestClient

from data_loader import loader
from main import app


@pytest.fixture(scope="session", autouse=True)
def loaded_catalog():
    loader.load()
    yield


@pytest.fixture
def client():
    return TestClient(app)


def test_catalog_load_baseline():
    assert loader.is_loaded is True
    assert len(loader.planets) == 6725
    assert loader.validation_summary["excludedMissingId"] == 0


def test_planet_type_distribution():
    counts = {
        "terrestrial": sum(p["planetType"] == "terrestrial" for p in loader.planets),
        "gas-giant": sum(p["planetType"] == "gas-giant" for p in loader.planets),
        "unknown": sum(p["planetType"] == "unknown" for p in loader.planets),
    }
    assert counts == {"terrestrial": 2089, "gas-giant": 2012, "unknown": 2624}


def test_health_and_catalog_endpoints(client):
    health = client.get("/api/v1/health")
    assert health.status_code == 200
    body = health.json()
    assert body["status"] == "healthy"
    assert body["dataset_loaded"] is True
    assert body["usable_records"] == 6725
    assert body["initialization_error"] is None

    planets = client.get("/api/v1/planets")
    rankings = client.get("/api/v1/rankings")
    stats = client.get("/api/v1/stats")
    assert planets.status_code == 200
    assert rankings.status_code == 200
    assert stats.status_code == 200
    assert len(planets.json()) == 6725
    assert len(rankings.json()) == 6725
    assert stats.json()["totalRecords"] == 6725


def test_invalid_planet_id(client):
    response = client.get("/api/v1/planet/NOT-A-REAL-KOI")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]


def test_individual_scientific_endpoint_schemas(client):
    planet_id = loader.planets[0]["id"]
    routes = [
        f"/api/v1/planet/{planet_id}",
        f"/api/v1/planet/{planet_id}/hite",
        f"/api/v1/planet/{planet_id}/hz",
        f"/api/v1/planet/{planet_id}/esi",
        f"/api/v1/planet/{planet_id}/stellar",
        f"/api/v1/planet/{planet_id}/ml",
        "/api/v1/hz/explorer",
        "/api/v1/model/info",
        "/api/v1/hite",
        "/api/v1/hite/stats",
        f"/api/v1/hite/{planet_id}",
    ]
    for route in routes:
        response = client.get(route)
        assert response.status_code == 200, (route, response.text)
        assert isinstance(response.json(), (dict, list))


def test_nasa_endpoint_schema(client):
    """NASA is supplementary; verify response structure without asserting remote availability."""
    planet_id = loader.planets[0]["id"]
    response = client.get(f"/api/v1/planet/{planet_id}/nasa")
    assert response.status_code == 200
    body = response.json()
    assert body["planet_id"] == planet_id
    assert "nasa_data" in body
    assert "source_note" in body


def test_hite_esi_and_hz_values_are_safe():
    for planet in loader.planets:
        for key in (
            "hiteScore",
            "hiteScorePrime",
            "hiteRockyProbability",
            "esi",
            "esiRadius",
            "esiDensity",
            "esiEscapeVelocity",
            "esiTemperature",
        ):
            value = planet.get(key)
            if value is not None:
                assert math.isfinite(value), (planet["id"], key, value)

        for key in (
            "hzInnerFluxConservative",
            "hzOuterFluxConservative",
            "hzInnerFluxOptimistic",
            "hzOuterFluxOptimistic",
            "hzInnerAU",
            "hzOuterAU",
        ):
            value = planet.get(key)
            if value is not None:
                assert math.isfinite(value), (planet["id"], key, value)


def test_random_forest_model_availability():
    model_info = loader.get_model_info()
    if model_info.get("trained"):
        assert 0.0 <= model_info["test_accuracy"] <= 1.0
        assert model_info["n_train_samples"] > 0
        assert model_info["n_test_samples"] > 0
        assert model_info["feature_importances"]
    else:
        assert model_info["trained"] is False
        assert model_info["error"]
