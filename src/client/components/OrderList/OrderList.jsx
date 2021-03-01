import React, { useMemo, useReducer } from "react";
import {
  EmptySearchResult,
  IndexTable,
  useIndexResourceState
} from "@shopify/polaris";
import useAllOrders from "../../hooks/useAllOrders";
import styles from './OrderList.module.scss'
import { useFetch } from "../../context/AppContext";
import { LoadingState, NoOrdersState } from "../States";
import { usePrinted } from "../../context/OrdersContext";
import { createPdf } from "../../helper";

const rowMarkup = (orders, selected) => orders.map((order, index) => {
  const { id, name, date, first, last, total, items } = order;
  return <IndexTable.Row
    id={id}
    key={id}
    selected={selected.includes(id)}
    position={index}>
    <IndexTable.Cell>{name}</IndexTable.Cell>
    <IndexTable.Cell>{`${first} ${last}`}</IndexTable.Cell>
    <IndexTable.Cell>{date}</IndexTable.Cell>
    <IndexTable.Cell>{total}</IndexTable.Cell>
    <IndexTable.Cell>{items} {items > 1 ? 'Items' : 'Item'}</IndexTable.Cell>
  </IndexTable.Row>
});

const Headings = [
  { title: 'Order' },
  { title: 'Customer' },
  { title: 'Date' },
  { title: 'Total' },
  { title: 'Items' }
];

const OrderList = ({ orders, loading, tagAction }) => {
  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
  } = useIndexResourceState(orders);
  const fetch = useFetch();

  return <div className={styles['c-index-table-checkbox']}>
    <IndexTable
      headings={Headings}
      itemCount={orders.length ?? 0}
      selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
      promotedBulkActions={[
        {
          content: 'Print packaging labels',
          onAction: () => createPdf(fetch, selectedResources)
        },
        {
          content: tagAction.content,
          onAction: () => tagAction.onAction(selectedResources)
        }
      ]}
      onSelectionChange={handleSelectionChange}
      loading={loading}
      emptyState={loading ? <LoadingState/> : <NoOrdersState/>}>
      {rowMarkup(orders, selectedResources)}
    </IndexTable>
  </div>
}

export default OrderList;
