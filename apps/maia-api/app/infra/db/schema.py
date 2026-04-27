def quote_schema_name(schema_name: str) -> str:
    stripped_schema_name = schema_name.strip()
    if not stripped_schema_name:
        raise ValueError("Database schema name cannot be empty.")

    escaped_schema_name = stripped_schema_name.replace('"', '""')
    return f'"{escaped_schema_name}"'


def create_schema_sql(schema_name: str) -> str:
    return f"CREATE SCHEMA IF NOT EXISTS {quote_schema_name(schema_name)}"
