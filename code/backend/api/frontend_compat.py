"""Frontend compatibility routes.

This blueprint reconciles the API contract that the web and mobile frontends
expect with the canonical routes served by ``api/main.py``. It provides:

1. Aliases that map frontend paths onto existing backend handlers
   (for example ``/api/auth/user`` -> the same data as ``/api/auth/me`` and
   ``/api/trades`` -> the same data as ``/api/trade/orders``).
2. Honest ``501 Not Implemented`` stubs for endpoints the frontends call that
   have no backend implementation yet (strategies CRUD, market data, risk
   metrics). These return a clear, machine-readable payload rather than a
   confusing ``404`` or a fabricated response.

Keeping these in a separate blueprint isolates the integration layer from the
core application routes.
"""

from backend.common.auth import require_auth
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity

compat_bp = Blueprint("frontend_compat", __name__)


def _not_implemented(feature: str, detail: str):
    """Return a consistent 501 payload for unimplemented features."""
    return (
        jsonify(
            {
                "error": "Not implemented",
                "message": detail,
                "code": "NOT_IMPLEMENTED",
                "feature": feature,
            }
        ),
        501,
    )


# ── Auth alias ──────────────────────────────────────────────────────────────
# The frontends call /api/auth/user; the canonical route is /api/auth/me.
@compat_bp.route("/api/auth/user", methods=["GET"])
@require_auth
def auth_user_alias():
    """Alias of /api/auth/me for frontend compatibility."""
    from backend.common.database import get_db_session
    from backend.common.models import User

    user_id = int(get_jwt_identity())
    with get_db_session() as session:
        user = session.query(User).filter(User.id == user_id).first()
        if not user:
            return (
                jsonify({"error": "User not found", "code": "USER_NOT_FOUND"}),
                404,
            )
        return jsonify(
            {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "roles": user.roles,
            }
        )


# ── Token refresh ───────────────────────────────────────────────────────────
# The mobile client posts to /api/auth/refresh with a refresh token in the JSON
# body ({"refreshToken": "..."}) to obtain a new access token. The auth layer
# already issues refresh tokens at login (create_refresh_token), so this is a
# complete implementation. The token is decoded and verified explicitly so it
# can be read from the body rather than the Authorization header.
@compat_bp.route("/api/auth/refresh", methods=["POST"])
def auth_refresh():
    """Issue a new access token from a valid refresh token in the body."""
    from flask_jwt_extended import decode_token

    data = request.get_json(silent=True) or {}
    refresh_token = data.get("refreshToken") or data.get("refresh_token")
    if not refresh_token:
        return (
            jsonify(
                {
                    "error": "Missing refresh token",
                    "code": "MISSING_REFRESH_TOKEN",
                }
            ),
            400,
        )
    try:
        decoded = decode_token(refresh_token)
        if decoded.get("type") != "refresh":
            raise ValueError("not a refresh token")
        user_id = decoded["sub"]
    except Exception:
        return (
            jsonify(
                {
                    "error": "Invalid refresh token",
                    "code": "INVALID_REFRESH_TOKEN",
                }
            ),
            401,
        )
    access_token = create_access_token(identity=str(user_id))
    return jsonify({"token": access_token, "token_type": "Bearer"}), 200


# ── Trades alias ────────────────────────────────────────────────────────────
# The frontends call /api/trades; the canonical route is /api/trade/orders.
@compat_bp.route("/api/trades", methods=["GET"])
@require_auth
def trades_alias():
    """Alias of /api/trade/orders for frontend compatibility.

    Returns the identical payload to the canonical handler so the two routes
    are interchangeable.
    """
    from backend.trading_engine.trading_engine import trading_engine

    user_id = int(get_jwt_identity())
    orders = trading_engine.get_orders(user_id)
    return jsonify(orders), 200


# ── Honest stubs for unimplemented features ─────────────────────────────────
@compat_bp.route("/api/strategies", methods=["GET", "POST"])
@compat_bp.route("/api/strategies/<strategy_id>", methods=["GET", "PATCH", "DELETE"])
@require_auth
def strategies_stub(strategy_id=None):
    """Strategies CRUD is not implemented in the backend yet."""
    return _not_implemented(
        "strategies",
        "Strategy management endpoints are not yet implemented on the backend.",
    )


@compat_bp.route("/api/portfolio/history", methods=["GET"])
@require_auth
def portfolio_history_stub():
    """Portfolio history time series is not implemented yet."""
    return _not_implemented(
        "portfolio_history",
        "Portfolio history is not yet implemented on the backend.",
    )


@compat_bp.route("/api/market-data/<symbol>", methods=["GET"])
@require_auth
def market_data_stub(symbol):
    """Market data is served by the standalone data-service, not the API."""
    return _not_implemented(
        "market_data",
        "Market data is served by the data-service; this gateway route is not "
        "yet wired to it.",
    )


@compat_bp.route("/api/risk/metrics/<strategy_id>", methods=["GET"])
@require_auth
def risk_metrics_stub(strategy_id):
    """Risk metrics are served by the standalone risk-service, not the API."""
    return _not_implemented(
        "risk_metrics",
        "Risk metrics are served by the risk-service; this gateway route is not "
        "yet wired to it.",
    )
