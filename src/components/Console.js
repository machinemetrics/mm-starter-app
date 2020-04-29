import React, { useState, useRef, useEffect } from 'react';
import GraphiQL from 'graphiql';
import GraphiQLExplorer from 'graphiql-explorer';
import 'graphiql/graphiql.css';
import { introspectSchema } from 'graphql-tools';
import { execute } from 'apollo-link';
import { link } from '../client';
import { parse } from 'graphql';

const fetcher = (operation) => {
  operation.query = parse(operation.query);
  return execute(link, operation);
};

const Console = () => {
  const graphiql = useRef(null);
  const [explorerIsOpen, setExplorerIsOpen] = useState(true);
  const [schema, setSchema] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    async function fetchSchema() {
      const graphqlSchema = await introspectSchema(link);
      const editor = graphiql.current.getQueryEditor();
      editor.setOption('extraKeys', { ...(editor.options.extraKeys || {}) });
      setSchema(graphqlSchema);
    }
    fetchSchema();
  }, []);

  return (
    <div className="graphiql-container">
      <GraphiQLExplorer
        schema={schema}
        query={query}
        explorerIsOpen={explorerIsOpen}
        onEdit={setQuery}
        onRunOperation={operation => graphiql.current.handleRunQuery(operation)}
        onToggleExplorer={() => setExplorerIsOpen(!explorerIsOpen)}
      />
      <GraphiQL
        fetcher={fetcher}
        ref={graphiql}
        schema={schema}
        query={query}
        onEditQuery={setQuery}
        >
        <GraphiQL.Toolbar>
          <GraphiQL.Button
            onClick={() => setExplorerIsOpen(!explorerIsOpen)}
            label="Explorer"
            title="Toggle Explorer"
          />
          <GraphiQL.Button
            onClick={() => graphiql.current.handleCopyQuery()}
            title="Copy Query (Shift-Ctrl-C)"
            label="Copy"
          />
          <GraphiQL.Button
            onClick={() => graphiql.current.handlePrettifyQuery()}
            label="Prettify"
            title="Prettify Query (Shift-Ctrl-P)"
          />
          <GraphiQL.Button
            onClick={() => graphiql.current.handleToggleHistory()}
            label="History"
            title="Show History"
          />
        </GraphiQL.Toolbar>
      </GraphiQL>
    </div>
  );
};

export default Console;
