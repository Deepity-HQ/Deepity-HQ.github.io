import { StrictMode } from "react";
import { prerender } from "react-dom/static";
import { StaticRouter } from "react-router";
import { Shell } from "./App.jsx";

export async function render(url) {
  const errors = [];
  const { prelude } = await prerender(
    <StrictMode>
      <StaticRouter location={url} basename="/">
        <Shell />
      </StaticRouter>
    </StrictMode>,
    { onError: (error) => errors.push(error) },
  );
  if (errors.length) throw new AggregateError(errors, `rendering ${url} failed`);
  return new Response(prelude).text();
}
