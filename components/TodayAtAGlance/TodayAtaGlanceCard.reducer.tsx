import { useReducer } from "react";
import {
  TodaysOrderDispatch,
  TodaysOrderState,
} from "./TodayAtAGlanceCard.model";

export const todaysOrdersReducer = (
  state: TodaysOrderState,
  action: TodaysOrderDispatch
): TodaysOrderState => {
  switch (action.type) {
    case "collapsed": {
      const targetIndex = state.collapsed.findIndex(
        (item) => item.title === action.target
      );

      if (targetIndex !== -1) {
        const updatedCollapsed = [...state.collapsed];
        const targetedEntity = updatedCollapsed[targetIndex];

        targetedEntity.isCollapsed = !targetedEntity.isCollapsed;

        return { ...state, collapsed: updatedCollapsed };
      }

      return { ...state };
    }
    case "orders": {
      const { orders, target } = action;

      if (target in state.orders) {
        return {
          ...state,
          orders: {
            ...state.orders,
            [target]: orders,
          },
        };
      }
      return state;
    }
    case "customers": {
      const { customers, target } = action;

      if (target in state.customers) {
        return {
          ...state,
          customers: {
            ...state.customers,
            [target]: customers,
          },
        };
      }
      return state;
    }
    case "chow": {
      const { chow, target } = action;

      if (target in state.chow) {
        return {
          ...state,
          chow: {
            ...state.chow,
            [target]: chow,
          },
        };
      }
      return state;
    }
  }
};

export const initialState: TodaysOrderState = {
  collapsed: [
    {
      title: "unpaidOrders",
      isCollapsed: true,
    },
    {
      title: "unpaidStock",
      isCollapsed: true,
    },
    {
      title: "completedOrders",
      isCollapsed: true,
    },
    {
      title: "completedStock",
      isCollapsed: true,
    },
  ],
  orders: { unpaidOrders: [], completedOrders: [] },
  customers: { outstandingCustomers: [], completedCustomers: [] },
  chow: { outstandingChow: [], completedChow: [] },
};
