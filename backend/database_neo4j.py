import os
import logging

try:
    from neo4j import GraphDatabase
    NEO4J_INSTALLED = True
except ImportError:
    NEO4J_INSTALLED = False

logger = logging.getLogger(__name__)

NEO4J_ENABLED = os.getenv("NEO4J_ENABLED", "false").lower() == "true"
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")

driver = None
is_neo4j_available = False

def init_neo4j():
    global driver, is_neo4j_available
    if not NEO4J_ENABLED:
        logger.info("Neo4j is disabled via NEO4J_ENABLED=false")
        return
    if not NEO4J_INSTALLED:
        logger.warning("Neo4j python driver is not installed. Disabling Neo4j.")
        return
        
    try:
        driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
        driver.verify_connectivity()
        is_neo4j_available = True
        logger.info("Successfully connected to Neo4j.")
    except Exception as e:
        logger.warning(f"Failed to connect to Neo4j. It will be disabled. Error: {e}")
        is_neo4j_available = False
        if driver:
            driver.close()
            driver = None

def get_neo4j_driver():
    return driver

def close_neo4j():
    if driver:
        driver.close()

init_neo4j()
