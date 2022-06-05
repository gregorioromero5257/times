export interface Report {
    status: string,
    finished: boolean,
    loading: boolean,
    version: bigint,
    id: bigint,
    name: string,
    activityId: bigint
}
