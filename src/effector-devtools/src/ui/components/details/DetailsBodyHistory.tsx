import { useStore, useStoreMap } from "effector-react";
import { ToolsMessage } from "./../../../common/types";

import React, { useContext, useEffect, useState } from "react";
import { $selectedMessage } from "../../store/details";
import { $logs } from "../../store/logs";
import { IdsProvider, Table, TableStateProvider } from "../../Table";
import { logNameMatcher } from "./useCurrentPrev";

export const DetailsBodyHistory = () => {
  const { setHotkeysActive } = useContext(TableStateProvider);
  const [selected, setSelected] = useState<number | false>(false);
  const [selectedTab, setSelectedTab] = useState<string>("");
  const selectedMessage = useStore($selectedMessage);

  useEffect(() => {
    setSelected(false);
  }, [setSelected, selectedMessage]);

  const passedLogIds = useStoreMap({
    store: $logs,
    keys: [selectedMessage?.name],
    fn: (logs, [sname]) => {
      const matcher = logNameMatcher(sname);

      const selectedLogs = Object.values(logs).reduce<ToolsMessage[]>(
        (acc, log) => {
          if (matcher(log.name)) {
            acc.push(log);
          }
          return acc;
        },
        []
      );

      selectedLogs.sort((a, b) => a.index - b.index);

      return selectedLogs.map(log => log.id);
    },
  });

  return (
    <div className="ed-details-body-history">
      <IdsProvider.Provider value={passedLogIds}>
        <TableStateProvider.Provider
          value={{
            selected,
            setSelected,
            selectedTab,
            setSelectedTab,
            hotkeysActive: true,
            parentSetHotkeysActive: setHotkeysActive,
            showHistory: false,
          }}
        >
          <Table />
        </TableStateProvider.Provider>
      </IdsProvider.Provider>
    </div>
  );
};
