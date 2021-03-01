import useAllOrders from "../hooks/useAllOrders";
import React, { useContext } from "react";
import { useFetch } from "./AppContext";

const Context = React.createContext({ printed: {}, notPrinted: {} });

const usePrinted = () => {
  return useContext(Context).printed;
}

const useNotPrinted = () => {
  return useContext(Context).notPrinted;
}

export { usePrinted, useNotPrinted };

const update = (ids, untag, tag, orders) => {
  const updatedOrders = orders.filter(order => ids.includes(order.id));
  const newOrders = orders.filter(order => !ids.includes(order.id));
  untag(newOrders);

  tag(ord => {
    const newList = [
      ...ord,
      ...updatedOrders
    ];
    return newList.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return 1;
      }
      if (nameA > nameB) {
        return -1;
      }
      return 0;
    })
  })
}

const OrdersContext = ({ children }) => {
  const { loading: pLoading, error: pError, data: pData, setData: pSetData } = useAllOrders(true);
  const { loading: nLoading, error: nError, data: nData, setData: nSetData } = useAllOrders(false);
  const fetch = useFetch();
  return <Context.Provider value={{
    printed: {
      loading: pLoading,
      error: pError,
      data: pData,
      title: 'Mark as not printed',
      update: async (ids) => {
        await fetch('/api/')
        update(ids, pSetData, nSetData, pData)
      }
    },
    notPrinted: {
      loading: nLoading,
      error: nError,
      data: nData,
      title: 'Mark as printed',
      update: async (ids) => {
        update(ids, nSetData, pSetData, nData)
      }
    }
  }}>
    {children}
  </Context.Provider>

}

export default OrdersContext;
