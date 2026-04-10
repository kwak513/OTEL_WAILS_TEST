export namespace models {
	
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

