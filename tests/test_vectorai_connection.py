from actian_vectorai import VectorAIClient


VECTORAI_URL = "localhost:6574"


def run_verification():
    client = None

    print("=" * 60)
    print("Actian VectorAI DB Connection Verification")
    print("=" * 60)
    print(f"Connecting to VectorAI DB at {VECTORAI_URL}...")

    try:
        # Create the client.
        # IMPORTANT: v1.0.2 expects host:port without http://
        client = VectorAIClient(url=VECTORAI_URL)

        # Explicitly establish the connection.
        client.connect()

        print("[OK] VectorAI DB connection")

        # Access the collections API only after connect()
        collections = client.collections

        print("[OK] Collections API available")

        # Display available collection methods.
        methods = [
            name
            for name in dir(collections)
            if not name.startswith("_")
        ]

        print()
        print("Available collection methods:")
        print(methods)

        print()
        print("=" * 60)
        print("VectorAI connection verification: PASSED")
        print("=" * 60)

        return True

    except Exception as exc:
        print()
        print("[FAILED] VectorAI verification failed")
        print(f"Error type: {type(exc).__name__}")
        print(f"Error: {exc}")
        print()
        print("=" * 60)
        print("VectorAI connection verification: FAILED")
        print("=" * 60)

        return False

    finally:
        if client is not None:
            try:
                client.close()
            except Exception:
                pass


if __name__ == "__main__":
    success = run_verification()

    if not success:
        raise SystemExit(1)