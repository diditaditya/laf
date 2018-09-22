module.exports = {
  query: {
    postgres: {
      getTables: `select * from pg_catalog.pg_tables where schemaname not like 'pg_%' and schemaname !='information_schema'`,
      getFields: tableName => {
        return `select column_name from information_schema.columns where table_name = '${tableName}'`;
      }
    }
  }
};
