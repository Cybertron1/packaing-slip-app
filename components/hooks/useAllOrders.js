import {gql, useQuery} from "@apollo/client";

const GET_ORDERS = gql`
{
  orders(first: 250, reverse: true, query:"fulfillment_status:unshipped") {
    edges {
      node {
        id
        name
      }
    }
  }
}
`;

const useAllOrders = () => {
  const {loading, error, data} = useQuery(GET_ORDERS);
  const returnData = data === undefined ? [] : data;
  return {loading, error, data: returnData};
};

export default useAllOrders;
