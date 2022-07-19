import { writable, get, derived } from 'svelte/store';
import { persist, localStorage } from '@macfja/svelte-persistent-store';
import { saveStatistics } from './stats';
import { serializeState, deserializeState } from './serde';
import mermaid from 'mermaid';

import type { Readable } from 'svelte/store';
import type { MarkerData, State, ValidatedState } from '$lib/types';

export const defaultState: State = {
	code: `erDiagram
    SUPPLIER ||..|| FUNDING-SOURCES : Is
    SUPPLIER-OPTIONAL {
        bool crossbordertransfer "Support cross border remittance service"
        bool crossborderpayment "Support cross border payment service"
        bool cryptocurrencyloan "Support crypto currency loan service"
        bool cryptocurrencyexchange "Support crypto currency exchange service"
        bool cryptocurrencypayment "Support crypto currency payment service"
    }
    FUNDING-SOURCES ||--o| SUPPLIER-OPTIONAL : Optional
    SUPPLIER-OPTIONAL ||--o| DPAY-FIAT-API : Throw
    SUPPLIER-OPTIONAL ||--o| DPAY-CRYPTO-API : Throw
    SUPPLIER-DEFAULT {
        bool localfiatloan "Support local fiat loan service"
        bool localfiattransfer "Support local fiat transfer service"
        bool localfiatpayment  "Support local fiat payment service"
    }
    FUNDING-SOURCES ||--o| SUPPLIER-DEFAULT : Provides
    SUPPLIER-DEFAULT ||--o| DPAY-FIAT-API : Throw
    SUPPLIER-DEFAULT ||--o| DPAY-CRYPTO-API : Throw
    DPAY-FIAT-API ||--o| DPAY-COMPOSITE-GATEWAY : To
    DPAY-CRYPTO-API ||--o| DPAY-COMPOSITE-GATEWAY : To
    SUPPLIER-GET {
        string globalpaymentsupport "Get global Safety payment capabilities"
        string globaltransfersupport "Get global cheap and fast remittance capabilities"
        string connectwebsitesupport "Get secure transmission of sensitive data by ETEE connection"
        string connectcrmsoftwaresupport "Get automated processes by dpay IFTE module"
        string cryptocurrencysupport "Get ability to handle cryptocurrency services"
    }
    DPAY-COMPOSITE-GATEWAY ||--o| DPAY-SUPPLIER-APP : Service
    DPAY-SUPPLIER-APP ||--o| SUPPLIER-GET : Provides
    SUPPLIER-GET ||--o| FUNDING-SOURCES : To
    MERCHANT ||..|| COMMODITY-SOURCES : Is
    DPAY-COMPOSITE-GATEWAY ||--o| DPAY-MERCHANT-APP : Service
    MERCHANT-GET {
        string connectshopsupport "Get ability to manage all stores in one place"
        string connectcrmsoftwaresupport "Get automated processes by dpay IFTE module"
        string globalpaymentsupport "Get receive cross border payment capabilities"
        string cryptocurrencysupport "Get ability to receive cryptocurrency payment"
    }
    DPAY-MERCHANT-APP ||--o| MERCHANT-GET : Provides
    MERCHANT-GET ||--o| COMMODITY-SOURCES : To
    DPAY-COMPOSITE-GATEWAY ||--o| DPAY-MAIN-APP : Service
    DPAY-MAIN-APP ||--o{ DEFAULT-FUNCTION: Provides
    DEFAULT-FUNCTION {
        string defauleteemessager "Secure and safity connection service"
        string compositewallet "Manage all accounts in one place"
        string connectotherapp "Connect to dpay bridge support app and automated processes by IFTE module"
        string localfiatloan
        string localfiattransfer
        string localfiatpayment
    }
    DEFAULT-FUNCTION ||--o| COMMODITY-SOURCES : To
    DEFAULT-FUNCTION ||--o| FUNDING-SOURCES : To
    DEFAULT-FUNCTION ||--o| CUSTOMER : To
    SUPPLIER-SUPPORT-FUNCTION {
        bool crossbordertransfer "If Supplier Support"
        bool crossborderpayment "If Supplier Support"
        bool cryptocurrencyloan "If Supplier Support"
        bool cryptocurrencyexchange "If Supplier Support"
        bool cryptocurrencypayment "If Supplier Support"
    }
    DPAY-SUPPLIER-APP ||--o{ SUPPLIER-SUPPORT-FUNCTION: Provides
    SUPPLIER-SUPPORT-FUNCTION ||--o| CUSTOMER : To
    CUSTOMER ||--o| LOAN-NEEDS : Produce
    CUSTOMER ||--o| TRANSFER-NEEDS : Produce
    CUSTOMER ||--o| SHOPPING-NEEDS : Produce
    SHOPPING-NEEDS ||--o| PAYMENT-NEEDS : Produce
    SHOPPING-NEEDS ||--o| DPAY-MERCHANT-APP : Request
    PAYMENT-NEEDS ||--o| DPAY-SUPPLIER-APP : Request
    LOAN-NEEDS ||--o| DPAY-SUPPLIER-APP : Request
    TRANSFER-NEEDS ||--o| DPAY-SUPPLIER-APP : Request
  `,
	mermaid: JSON.stringify(
		{
			theme: 'default'
		},
		null,
		2
	),
	updateEditor: false,
	autoSync: true,
	updateDiagram: true
};

const urlParseFailedState = `graph TD
    A[Loading URL failed. We can try to figure out why.] -->|Decode JSON| B(Please check the console to see the JSON and error details.)
    B --> C{Is the JSON correct?}
    C -->|Yes| D(Please Click here to Raise an issue in github.<br/>Including the broken link in the issue <br/> will speed up the fix.)
    C -->|No| E{Did someone <br/>send you this link?}
    E -->|Yes| F[Ask them to send <br/>you the complete link]
    E -->|No| G{Did you copy <br/> the complete URL?}
    G --> |Yes| D
    G --> |"No :("| H(Try using the Timeline tab in History <br/>from same browser you used to create the diagram.)
    click D href "https://github.com/mermaid-js/mermaid-live-editor/issues/new?assignees=&labels=bug&template=bug_report.md&title=Broken%20link" "Raise issue"`;

// inputStateStore handles all updates and is shared externally when exporting via URL, History, etc.
export const inputStateStore = persist(writable(defaultState), localStorage(), 'codeStore');

// All internal reads should be done via stateStore, but it should not be persisted/shared externally.
export const stateStore: Readable<ValidatedState> = derived([inputStateStore], ([state]) => {
	const processed: ValidatedState = {
		...state,
		serialized: '',
		errorMarkers: [],
		error: undefined
	};
	// No changes should be done to fields part of `state`.
	try {
		processed.serialized = serializeState(state);
		mermaid.parse(state.code);
		JSON.parse(state.mermaid);
	} catch (e) {
		processed.error = e;
		console.error(e);
		if (e.hash) {
			try {
				const marker: MarkerData = {
					severity: 8, // Error
					startLineNumber: e.hash.loc.first_line,
					startColumn: e.hash.loc.first_column,
					endLineNumber: e.hash.loc.last_line,
					endColumn: (e.hash.loc.last_column as number) + 1,
					message: e.str
				};
				processed.errorMarkers = [marker];
			} catch (err) {
				console.error('Error without line helper', err);
			}
		}
	}
	return processed;
});

export const loadState = (data: string): void => {
	let state: State;
	console.log('Loading', data);
	try {
		state = deserializeState(data);
		const mermaidConfig: { [key: string]: string } =
			typeof state.mermaid === 'string' ? JSON.parse(state.mermaid) : state.mermaid;
		if (
			mermaidConfig.securityLevel &&
			mermaidConfig.securityLevel !== 'strict' &&
			confirm(
				`Removing "securityLevel":"${mermaidConfig.securityLevel}" from the config for safety.\nClick Cancel if you trust the source of this Diagram.`
			)
		) {
			delete mermaidConfig.securityLevel; // Prevent setting overriding securityLevel when loading state to mitigate possible XSS attack
		}
		state.mermaid = JSON.stringify(mermaidConfig, null, 2);
	} catch (e) {
		state = get(inputStateStore);
		if (data) {
			console.error('Init error', e);
			state.code = urlParseFailedState;
			state.mermaid = defaultState.mermaid;
		}
	}
	updateCodeStore({ ...state, updateEditor: true });
};

export const updateCodeStore = (newState: State): void => {
	inputStateStore.update((state) => {
		return { ...state, ...newState };
	});
};

let prompted = false;
export const updateCode = (
	code: string,
	{ updateEditor, updateDiagram = false }: { updateEditor: boolean; updateDiagram?: boolean }
): void => {
	saveStatistics(code);
	const lines = (code.match(/\n/g) || '').length + 1;

	if (lines > 50 && !prompted && get(stateStore).autoSync) {
		const turnOff = confirm(
			'Long diagram detected. Turn off Auto Sync? Click the sync logo to manually sync.'
		);
		prompted = true;
		if (turnOff) {
			updateCodeStore({
				autoSync: false
			} as State);
		}
	}
	
	inputStateStore.update((state) => {
		return { ...state, code, updateEditor, updateDiagram };
	});
};

export const updateConfig = (config: string, updateEditor: boolean): void => {
	inputStateStore.update((state) => {
		return { ...state, mermaid: config, updateEditor };
	});
};

export const toggleDarkTheme = (dark: boolean): void => {
	inputStateStore.update((state) => {
		const config = JSON.parse(state.mermaid);
		if (!config.theme || ['dark', 'default'].includes(config.theme)) {
			config.theme = dark ? 'dark' : 'default';
		}

		return { ...state, mermaid: JSON.stringify(config, null, 2), updateEditor: true };
	});
};

export const initURLSubscription = (): void => {
	stateStore.subscribe(({ serialized }) => {
		history.replaceState(undefined, undefined, `#${serialized}`);
	});
};

export const getStateString = (): string => {
	return JSON.stringify(get(inputStateStore));
};
