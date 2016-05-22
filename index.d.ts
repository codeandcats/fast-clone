declare module 'fast-clone' {
	interface IValueResult {
		value: any;
	}
	
	interface IFastCloneOptions {
		getValue?: (key: string, value: any) => IValueResult;
	}
	
	export default function(value: any, options?: IFastCloneOptions);
	
	export function clone(value: any, options?: IFastCloneOptions);
}
