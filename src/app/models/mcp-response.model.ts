export interface McpResponse {
  tool_calls?: {
    tool_name?: string;
    [key: string]: any;
  }[];
  [key: string]: any;
}
