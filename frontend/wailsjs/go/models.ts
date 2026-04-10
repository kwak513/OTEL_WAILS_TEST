export namespace models {
	
	export class LogData {
	    attributes_bool: Record<string, boolean>;
	    attributes_number: Record<string, number>;
	    attributes_string: Record<string, string>;
	    body: string;
	    id: string;
	    resources_string: Record<string, string>;
	    serviceName: string;
	    scope_name: string;
	    scope_string: Record<string, string>;
	    scope_version: string;
	    severity_number: number;
	    severity_text: string;
	    span_id: string;
	    trace_flags: number;
	    trace_id: string;
	
	    static createFrom(source: any = {}) {
	        return new LogData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.attributes_bool = source["attributes_bool"];
	        this.attributes_number = source["attributes_number"];
	        this.attributes_string = source["attributes_string"];
	        this.body = source["body"];
	        this.id = source["id"];
	        this.resources_string = source["resources_string"];
	        this.serviceName = source["serviceName"];
	        this.scope_name = source["scope_name"];
	        this.scope_string = source["scope_string"];
	        this.scope_version = source["scope_version"];
	        this.severity_number = source["severity_number"];
	        this.severity_text = source["severity_text"];
	        this.span_id = source["span_id"];
	        this.trace_flags = source["trace_flags"];
	        this.trace_id = source["trace_id"];
	    }
	}
	export class LogEntry {
	    timestamp: string;
	    data: LogData;
	
	    static createFrom(source: any = {}) {
	        return new LogEntry(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.timestamp = source["timestamp"];
	        this.data = this.convertValues(source["data"], LogData);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class LogsQueryResult {
	    queryName: string;
	    list: LogEntry[];
	
	    static createFrom(source: any = {}) {
	        return new LogsQueryResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.queryName = source["queryName"];
	        this.list = this.convertValues(source["list"], LogEntry);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class LogsQueryData {
	    resultType: string;
	    result: LogsQueryResult[];
	
	    static createFrom(source: any = {}) {
	        return new LogsQueryData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.resultType = source["resultType"];
	        this.result = this.convertValues(source["result"], LogsQueryResult);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class LogsQueryRangeResponse {
	    status: string;
	    data: LogsQueryData;
	
	    static createFrom(source: any = {}) {
	        return new LogsQueryRangeResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.status = source["status"];
	        this.data = this.convertValues(source["data"], LogsQueryData);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class Metric {
	    metric_name: string;
	    description: string;
	    type: string;
	    unit: string;
	    timeseries: number;
	    samples: number;
	    lastReceived: number;
	
	    static createFrom(source: any = {}) {
	        return new Metric(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.metric_name = source["metric_name"];
	        this.description = source["description"];
	        this.type = source["type"];
	        this.unit = source["unit"];
	        this.timeseries = source["timeseries"];
	        this.samples = source["samples"];
	        this.lastReceived = source["lastReceived"];
	    }
	}
	export class MetricsData {
	    metrics: Metric[];
	    total: number;
	
	    static createFrom(source: any = {}) {
	        return new MetricsData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.metrics = this.convertValues(source["metrics"], Metric);
	        this.total = source["total"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class MetricsResponse {
	    status: string;
	    data: MetricsData;
	
	    static createFrom(source: any = {}) {
	        return new MetricsResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.status = source["status"];
	        this.data = this.convertValues(source["data"], MetricsData);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class TracesQueryRangeRowData {
	    durationNano: number;
	    name: string;
	    responseStatusCode: string;
	    serviceName: string;
	    spanID: string;
	    traceID: string;
	
	    static createFrom(source: any = {}) {
	        return new TracesQueryRangeRowData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.durationNano = source["durationNano"];
	        this.name = source["name"];
	        this.responseStatusCode = source["responseStatusCode"];
	        this.serviceName = source["serviceName"];
	        this.spanID = source["spanID"];
	        this.traceID = source["traceID"];
	    }
	}
	export class TracesQueryRangeRow {
	    timestamp: string;
	    data: TracesQueryRangeRowData;
	
	    static createFrom(source: any = {}) {
	        return new TracesQueryRangeRow(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.timestamp = source["timestamp"];
	        this.data = this.convertValues(source["data"], TracesQueryRangeRowData);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class TracesQueryRangeItem {
	    queryName: string;
	    list: TracesQueryRangeRow[];
	
	    static createFrom(source: any = {}) {
	        return new TracesQueryRangeItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.queryName = source["queryName"];
	        this.list = this.convertValues(source["list"], TracesQueryRangeRow);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class TracesQueryRangeData {
	    resultType: string;
	    result: TracesQueryRangeItem[];
	
	    static createFrom(source: any = {}) {
	        return new TracesQueryRangeData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.resultType = source["resultType"];
	        this.result = this.convertValues(source["result"], TracesQueryRangeItem);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class TracesQueryRangeResponse {
	    status: string;
	    data: TracesQueryRangeData;
	
	    static createFrom(source: any = {}) {
	        return new TracesQueryRangeResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.status = source["status"];
	        this.data = this.convertValues(source["data"], TracesQueryRangeData);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	

}

