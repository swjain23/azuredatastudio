/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as azdata from 'azdata';
import * as vscode from 'vscode';

export const NoteBookEnvironmentVariablePrefix = 'AZDATA_NB_VAR_';

export interface ResourceType {
	name: string;
	displayName: string;
	description: string;
	platforms: string[] | '*';
	icon: { light: string; dark: string };
	options: ResourceTypeOption[];
	providers: DeploymentProvider[];
	agreement?: AgreementInfo;
	displayIndex?: number;
	getProvider(selectedOptions: { option: string, value: string }[]): DeploymentProvider | undefined;
}

export interface AgreementInfo {
	template: string;
	links: azdata.LinkArea[];
}

export interface ResourceTypeOption {
	name: string;
	displayName: string;
	values: ResourceTypeOptionValue[];
}

export interface ResourceTypeOptionValue {
	name: string;
	displayName: string;
}

export interface DialogDeploymentProvider extends DeploymentProviderBase {
	dialog: DialogInfo;
}

export interface WizardDeploymentProvider extends DeploymentProviderBase {
	wizard: WizardInfo;
}

export interface NotebookDeploymentProvider extends DeploymentProviderBase {
	notebook: string | NotebookInfo;
}

export interface WebPageDeploymentProvider extends DeploymentProviderBase {
	webPageUrl: string;
}

export interface DownloadDeploymentProvider extends DeploymentProviderBase {
	downloadUrl: string;
}

export interface CommandDeploymentProvider extends DeploymentProviderBase {
	command: string;
}

export function instanceOfDialogDeploymentProvider(obj: any): obj is DialogDeploymentProvider {
	return obj && 'dialog' in obj;
}

export function instanceOfWizardDeploymentProvider(obj: any): obj is WizardDeploymentProvider {
	return obj && 'wizard' in obj;
}

export function instanceOfNotebookDeploymentProvider(obj: any): obj is NotebookDeploymentProvider {
	return obj && 'notebook' in obj;
}

export function instanceOfWebPageDeploymentProvider(obj: any): obj is WebPageDeploymentProvider {
	return obj && 'webPageUrl' in obj;
}

export function instanceOfDownloadDeploymentProvider(obj: any): obj is DownloadDeploymentProvider {
	return obj && 'downloadUrl' in obj;
}

export function instanceOfCommandDeploymentProvider(obj: any): obj is CommandDeploymentProvider {
	return obj && 'command' in obj;
}

export interface DeploymentProviderBase {
	requiredTools: ToolRequirementInfo[];
	when: string;
}

export type DeploymentProvider = DialogDeploymentProvider | WizardDeploymentProvider | NotebookDeploymentProvider | WebPageDeploymentProvider | DownloadDeploymentProvider | CommandDeploymentProvider;

export interface WizardInfo {
	notebook: string | NotebookInfo;
	type: BdcDeploymentType;
}

export interface NotebookBasedDialogInfo extends DialogInfoBase {
	notebook: string | NotebookInfo;
	runNotebook?: boolean;
	taskName?: string;
}

export interface CommandBasedDialogInfo extends DialogInfoBase {
	command: string;
}

export type DialogInfo = NotebookBasedDialogInfo | CommandBasedDialogInfo;

export function instanceOfNotebookBasedDialogInfo(obj: any): obj is NotebookBasedDialogInfo {
	return obj && 'notebook' in obj;
}

export function instanceOfCommandBasedDialogInfo(obj: any): obj is CommandBasedDialogInfo {
	return obj && 'command' in obj;
}

export interface DialogInfoBase {
	title: string;
	name: string;
	tabs: DialogTabInfo[];
	actionText?: string;
}

export interface DialogTabInfo {
	title: string;
	sections: SectionInfo[];
	labelWidth?: string;
	inputWidth?: string;
}

export interface SectionInfo {
	title: string;
	fields?: FieldInfo[]; // Use this if the dialog is not wide. All fields will be displayed in one column, label will be placed on top of the input component.
	rows?: RowInfo[]; // Use this for wide dialog or wizard. label will be placed to the left of the input component.
	labelWidth?: string;
	inputWidth?: string;
	labelPosition?: LabelPosition; // Default value is top
	collapsible?: boolean;
	collapsed?: boolean;
	spaceBetweenFields?: string;
}

export interface RowInfo {
	fields: FieldInfo[];
}

export interface FieldInfo {
	label: string;
	variableName?: string;
	type: FieldType;
	defaultValue?: string;
	confirmationRequired?: boolean;
	confirmationLabel?: string;
	min?: number;
	max?: number;
	required?: boolean;
	options?: string[] | azdata.CategoryValue[];
	placeHolder?: string;
	userName?: string; // needed for sql server's password complexity requirement check, password can not include the login name.
	labelWidth?: string;
	inputWidth?: string;
	description?: string;
	labelPosition?: LabelPosition; // overwrite the labelPosition of SectionInfo.
	fontStyle?: FontStyle;
	labelFontWeight?: FontWeight;
	links?: azdata.LinkArea[];
	editable?: boolean; // for editable dropdown
}

export const enum LabelPosition {
	Top = 'top',
	Left = 'left'
}

export const enum FontStyle {
	Normal = 'normal',
	Italic = 'italic'
}

export enum FontWeight {
	Normal = 'normal',
	Bold = 'bold'
}

export enum FieldType {
	Text = 'text',
	Number = 'number',
	DateTimeText = 'datetime_text',
	SQLPassword = 'sql_password',
	Password = 'password',
	Options = 'options',
	ReadonlyText = 'readonly_text',
	Checkbox = 'checkbox'
}

export interface NotebookInfo {
	win32: string;
	darwin: string;
	linux: string;
}

export enum OsDistribution {
	win32 = 'win32',
	darwin = 'darwin',
	debian = 'debian',
	others = 'others'
}
export interface OsRelease extends JSON {
	type: string;
	platform: string;
	hostname: string;
	arch: string;
	release: string;
	id?: string;
	id_like?: string;
}

export interface ToolRequirementInfo {
	name: string;
	version: string;
}

export enum ToolType {
	AzCli,
	KubeCtl,
	Docker,
	Azdata
}

export const enum ToolStatus {
	NotInstalled = 'NotInstalled',
	Installed = 'Installed',
	Installing = 'Installing',
	Error = 'Error',
	Failed = 'Failed'
}

export interface ITool {
	readonly isInstalling: boolean;
	readonly name: string;
	readonly displayName: string;
	readonly description: string;
	readonly type: ToolType;
	readonly homePage: string;
	readonly displayStatus: string;
	readonly dependencyMessages: string[];
	readonly statusDescription: string | undefined;
	readonly autoInstallSupported: boolean;
	readonly autoInstallRequired: boolean;
	readonly isNotInstalled: boolean;
	readonly isInstalled: boolean;
	readonly installationPath: string;
	readonly needsInstallation: boolean;
	readonly outputChannelName: string;
	readonly fullVersion: string | undefined;
	readonly onDidUpdateData: vscode.Event<ITool>;
	showOutputChannel(preserveFocus?: boolean): void;
	loadInformation(): Promise<void>;
	install(): Promise<void>;
	isSameOrNewerThan(version: string): boolean;
}

export const enum BdcDeploymentType {
	NewAKS = 'new-aks',
	ExistingAKS = 'existing-aks',
	ExistingKubeAdm = 'existing-kubeadm'
}

export interface Command {
	command: string;
	sudo?: boolean;
	comment?: string;
	workingDirectory?: string;
	additionalEnvironmentVariables?: NodeJS.ProcessEnv;
	ignoreError?: boolean;
}
