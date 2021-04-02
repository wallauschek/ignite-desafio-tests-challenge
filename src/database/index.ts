import { Connection, createConnection, getConnectionOptions } from "typeorm";

interface IOptions {
  host: string;
  database: string;
}

getConnectionOptions().then((options) => {
  const newOptions = options as IOptions;
  newOptions.host = process.env.NODE_ENV === "test" ? "localhost" : "database";
  (newOptions.database =
    process.env.NODE_ENV === "test" ? "fin_api_test" : "fin_api"), //Essa opção deverá ser EXATAMENTE o nome dado ao service do banco de dados
    createConnection({
      ...options,
    });
});

export default async (): Promise<Connection> => {
  return createConnection();
};
