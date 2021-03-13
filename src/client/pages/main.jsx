import React, { useCallback, useState } from "react";
import { Tabs } from "@shopify/polaris";
import OrderList from "../components/OrderList";
import useAllOrders from "../hooks/useAllOrders";
import { useFetch } from "../context/AppContext";
import { createPdf } from "../helper";
import { NoOrdersState } from "../components/States";

const update = (selected, untag, tag, allOrders) => {
  const withoutSelected = allOrders.filter(order => !selected.find(sel => sel.id === order.id));
  untag(withoutSelected);

  tag(ord => {
    const newList = [
      ...ord,
      ...selected
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

const execute = async (fetch, body, path) => {
  await fetch(`/api/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
}

const usePrintedList = (printed, setPrinted, setNotPrinted) => {
  const printedObject = useAllOrders(true, setPrinted);
  const fetch = useFetch();
  const noOrderState = <NoOrdersState printed={true}/>
  return <OrderList
    {...printedObject}
    orders={printed}
    tagAction={{
      onAction: async (selected) => {
        const body = selected.map(id => id.id);
        await execute(fetch, body, 'untag');
        update(selected, setPrinted, setNotPrinted, printed);
      },
      content: "Remove printed tag"
    }}
    printAction={async (selected) => {
      await createPdf(fetch, selected)
    }}
    noOrderState={noOrderState}
  />
}

const useNotPrintedList = (notPrinted, setNotPrinted, setPrinted) => {
  const notPrintedObject = useAllOrders(false, setNotPrinted);
  const fetch = useFetch();

  const tag = async (selected) => {
    const body = selected.map(id => id.id);
    await execute(fetch, body, 'tag');
    update(selected, setNotPrinted, setPrinted, notPrinted);
  }
  const noOrderState = <NoOrdersState printed={false}/>
  return <OrderList
    {...notPrintedObject}
    orders={notPrinted}
    tagAction={{
      onAction: async (selected) => {
        await tag(selected)
      },
      content: "Add printed tag"
    }}
    printAction={async (selected) => {
      await createPdf(fetch, selected);
      await tag(selected);
    }}
    noOrderState={noOrderState}
  />
}


const Main = () => {
  const [selected, setSelected] = useState(0);
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );
  const [printed, setPrinted] = useState([]);
  const [notPrinted, setNotPrinted] = useState([]);
  const printedList = usePrintedList(printed, setPrinted, setNotPrinted);
  const notPrintedList = useNotPrintedList(notPrinted, setNotPrinted, setPrinted);
  const tabs = [
    {
      content: 'Not printed',
      component: notPrintedList,
      id: 'not-printed-orders'
    },
    {
      content: 'Printed',
      component: printedList,
      id: 'printed-orders'
    }
  ];

  return <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted>
    {tabs[selected].component}
  </Tabs>
}

export default Main;
