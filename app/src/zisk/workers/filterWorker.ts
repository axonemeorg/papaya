import { DownstreamFilter } from "@/contexts/JournalFilterContext"; 

self.onmessage = function (e: MessageEvent<DownstreamFilter[]>) {
  const records = e.data;
  self.postMessage(records);
};

export {};
