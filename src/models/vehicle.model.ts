export enum TimelineEventTypes {
    ADVERTISEMENT = 'advertisement',
    MOT_TEST = 'mot_test',
    VRM_CHANGE = 'vrm_change',

}

export interface VehicleDetails {
    id: string;
    vrm: string;
    model: string;
    make: string;
    registrationDate: number;
    timeline?: TimelineEvent[];

}

export interface TimelineEvent {
    eventType: TimelineEventTypes;
    eventDetails : AdvertisementEvent | MotTestEvent | VrmChangeEvent;
}

export interface TimelineSpecificEvent<T > {
    eventType: TimelineEventTypes;
    eventDetails : T;
}

export interface BaseTimelineEvent {
    date: number;
    mileage: number;
}

export interface AdvertisementEvent extends BaseTimelineEvent {
    price: number;
}

export interface MotTestEvent extends BaseTimelineEvent {

}

export interface VrmChangeEvent {
    fromVrm: string;
    toVrm: string;
}
