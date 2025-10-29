// Agent name, used to identify the agent in the settings
export enum AgentNameEnum {
  Planner = 'planner',
  Navigator = 'navigator',
  Validator = 'validator',
}
const CHIRAG_DEFAULT_MODEL = '/models/qwen';
// Provider type, types before CustomOpenAI are built-in providers, CustomOpenAI is a custom provider
// For built-in providers, we will create ChatModel instances with its respective LangChain ChatModel classes
// For custom providers, we will create ChatModel instances with the ChatOpenAI class
export enum ProviderTypeEnum {
  Gemini = 'gemini',
  CustomOpenAI = 'custom_openai',
}

// Default supported models for each built-in provider
export const llmProviderModelNames = {
  [ProviderTypeEnum.CustomOpenAI]: [CHIRAG_DEFAULT_MODEL],
  [ProviderTypeEnum.Gemini]: ['gemini-2.5-flash'],
};

// Default parameters for each agent per provider, for providers not specified, use OpenAI parameters
export const llmProviderParameters = {
  [ProviderTypeEnum.CustomOpenAI]: {
    [AgentNameEnum.Planner]: {
      temperature: 0.1,
      topP: 0.1,
    },
    [AgentNameEnum.Navigator]: {
      temperature: 0.1,
      topP: 0.1,
    },
    [AgentNameEnum.Validator]: {
      temperature: 0.1,
      topP: 0.1,
    },
  },
  [ProviderTypeEnum.Gemini]: {
    [AgentNameEnum.Planner]: {
      temperature: 0.1,
      topP: 0.1,
    },
    [AgentNameEnum.Navigator]: {
      temperature: 0.1,
      topP: 0.1,
    },
    [AgentNameEnum.Validator]: {
      temperature: 0.1,
      topP: 0.1,
    },
  },
};
