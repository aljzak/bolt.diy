import React, { useEffect } from 'react';
import type { ProviderInfo } from '~/types/model';
import type { ModelInfo } from '~/lib/modules/llm/types';
import { classNames } from '~/utils/classNames';
import styles from './Chat.module.scss'

interface ModelSelectorProps {
    model?: string;
    setModel?: (model: string) => void;
    provider?: ProviderInfo;
    setProvider?: (provider: ProviderInfo) => void;
    modelList: ModelInfo[];
    providerList: ProviderInfo[];
    apiKeys: Record<string, string>;
    modelLoading?: string;
  }


export const ModelSelector = ({
  model,
  setModel,
  provider,
  setProvider,
  modelList,
  providerList,
  modelLoading,
}: ModelSelectorProps) => {

    useEffect(() => {
        // If current provider is disabled, switch to first enabled provider
        if (providerList.length === 0) {
            return;
        }

        if (provider && !providerList.map((p) => p.name).includes(provider.name)) {
            const firstEnabledProvider = providerList[0];
            setProvider?.(firstEnabledProvider);

            // Also update the model to the first available one for the new provider
            const firstModel = modelList.find((m) => m.provider === firstEnabledProvider.name);

            if (firstModel) {
              setModel?.(firstModel.name);
            }
        }
    }, [providerList, provider, setProvider, modelList, setModel]);

    if (providerList.length === 0) {
        return (
            <div className="mb-2 p-4 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-prompt-background text-bolt-elements-textPrimary">
            <p className="text-center">
                No providers are currently enabled. Please enable at least one provider in the settings to start using the
                chat.
            </p>
            </div>
        );
    }

    return (
    <div className="mb-2 flex gap-2 flex-col sm:flex-row">
        {/* Provider Select Dropdown */}
        <select
          value={provider?.name ?? ''}
          onChange={(e) => {
            const newProvider = providerList.find((p: ProviderInfo) => p.name === e.target.value);

              if (newProvider && setProvider) {
                setProvider(newProvider);
            }

              const firstModel = [...modelList].find((m) => m.provider === e.target.value);

              if (firstModel && setModel) {
                setModel(firstModel.name);
              }
            }}
            className={classNames(styles.select, styles.providerSelect, "flex-1 p-2 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-prompt-background text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-bolt-elements-focus transition-all")}
            defaultValue="openrouter"  //Setting "openrouter" as default
        >
            {providerList.map((provider: ProviderInfo) => (
            <option key={provider.name} value={provider.name}>
                {provider.name}
            </option>
            ))}
        </select>
       {/* Model Select Dropdown */}
        <select
           key={provider?.name}
            value={model}
           onChange={(e) => setModel?.(e.target.value)}
            className={classNames(styles.select, styles.modelSelect, "flex-1 p-2 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-prompt-background text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-bolt-elements-focus transition-all lg:max-w-[70%]")}
           disabled={modelLoading === 'all' || modelLoading === provider?.name}
            defaultValue="anthropic.claude-3-sonnet-20240229-v1:0" //Setting "anthropic.claude-3-sonnet-20240229-v1:0" as default
         >
          {modelLoading === 'all' || modelLoading === provider?.name ? (
                <option key={0} value="">
                Loading...
                </option>
            ) : (
                [...modelList]
                .filter((e) => e.provider === provider?.name && e.name)
              .map((modelOption, index) => (
                  <option key={index} value={modelOption.name}>
                    {modelOption.label}
                  </option>
              ))
            )}
        </select>
    </div>
  );
};
