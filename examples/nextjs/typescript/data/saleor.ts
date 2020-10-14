import { SaleorManager } from "@saleor/sdk";

const config = { apiUrl: "http://localhost:8000/graphql/" };
const manager = new SaleorManager(config);

export default manager;
