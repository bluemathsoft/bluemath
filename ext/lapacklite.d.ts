

export namespace Module {
    type EnvironmentType = "WEB" | "NODE" | "SHELL" | "WORKER";

    function print(str: string): void;
    function printErr(str: string): void;
    var arguments_: string[];
    var environment: EnvironmentType;
    var preInit: { ():  void }[];
    var preRun: { ():  void }[];
    var postRun: { ():  void }[];
    var preinitializedWebGLContext: WebGLRenderingContext;
    var noInitialRun: boolean;
    var noExitRuntime: boolean;
    var logReadFiles: boolean;
    var filePackagePrefixURL: string;
    var wasmBinary: ArrayBuffer;

    function destroy(object: object): void;
    function getPreloadedPackage(remotePackageName: string, remotePackageSize: number): ArrayBuffer;
    function locateFile(url: string): string;
    function onCustomMessage(event: MessageEvent): void;

    var Runtime: any;

    function ccall(ident: string, returnType: string, argTypes: string[], args: any[]): any;
    function cwrap(ident: string, returnType: string|null, argTypes: string[]): any;

    function setValue(ptr: number, value: any, type: string, noSafe?: boolean): void;
    function getValue(ptr: number, type: string, noSafe?: boolean): number;

    var ALLOC_NORMAL: number;
    var ALLOC_STACK: number;
    var ALLOC_STATIC: number;
    var ALLOC_DYNAMIC: number;
    var ALLOC_NONE: number;

    function allocate(slab: any, types: string, allocator: number, ptr: number): number;
    function allocate(slab: any, types: string[], allocator: number, ptr: number): number;

    function Pointer_stringify(ptr: number, length?: number): string;
    function UTF16ToString(ptr: number): string;
    function stringToUTF16(str: string, outPtr: number): void;
    function UTF32ToString(ptr: number): string;
    function stringToUTF32(str: string, outPtr: number): void;

    // USE_TYPED_ARRAYS == 1
    var HEAP: Int32Array;
    var IHEAP: Int32Array;
    var FHEAP: Float64Array;

    // USE_TYPED_ARRAYS == 2
    var HEAP8: Int8Array;
    var HEAP16: Int16Array;
    var HEAP32: Int32Array;
    var HEAPU8:  Uint8Array;
    var HEAPU16: Uint16Array;
    var HEAPU32: Uint32Array;
    var HEAPF32: Float32Array;
    var HEAPF64: Float64Array;

    var TOTAL_STACK: number;
    var TOTAL_MEMORY: number;
    var FAST_MEMORY: number;

    function addOnPreRun(cb: () => any): void;
    function addOnInit(cb: () => any): void;
    function addOnPreMain(cb: () => any): void;
    function addOnExit(cb: () => any): void;
    function addOnPostRun(cb: () => any): void;

    // Tools
    function intArrayFromString(stringy: string, dontAddNull?: boolean, length?: number): number[];
    function intArrayToString(array: number[]): string;
    function writeStringToMemory(str: string, buffer: number, dontAddNull: boolean): void;
    function writeArrayToMemory(array: number[], buffer: number): void;
    function writeAsciiToMemory(str: string, buffer: number, dontAddNull: boolean): void;

    function addRunDependency(id: any): void;
    function removeRunDependency(id: any): void;


    var preloadedImages: any;
    var preloadedAudios: any;

    export function _malloc(size: number): number;
    function _free(ptr: number): void;
    function setValue(p:number, n:number, type:string):void;
}

