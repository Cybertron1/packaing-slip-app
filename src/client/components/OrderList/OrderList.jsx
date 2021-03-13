import React from "react";
import {
  IndexTable,
  useIndexResourceState
} from "@shopify/polaris";
import styles from './OrderList.module.scss'
import { LoadingState } from "../States";

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

const OrderList = ({ orders, loading, tagAction, printAction, error, noOrderState }) => {
  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
  } = useIndexResourceState(orders);

  return <div className={styles['c-index-table-checkbox']}>
    <IndexTable
      headings={Headings}
      itemCount={orders.length ?? 0}
      selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
      promotedBulkActions={[
        {
          content: 'Print',
          onAction: async () => {
            await printAction(orders.filter(order => selectedResources.includes(order.id)));
            handleSelectionChange("all", false, [0, 0]);
          }
        },
        {
          content: tagAction.content,
          onAction: async () => {
            await tagAction.onAction(orders.filter(order => selectedResources.includes(order.id)))
            handleSelectionChange("all", false, [0, 0]);
          }
        }
      ]}
      onSelectionChange={handleSelectionChange}
      loading={loading}
      emptyState={loading ? <LoadingState/> : noOrderState}>
      {rowMarkup(orders, selectedResources)}
    </IndexTable>
  </div>
}

export default OrderList;
