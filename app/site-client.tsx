"use client";

import { App } from "../src/App.jsx";

export function SiteClient({ initialRoute }: { initialRoute: string }) {
  return <App initialRoute={initialRoute} />;
}
