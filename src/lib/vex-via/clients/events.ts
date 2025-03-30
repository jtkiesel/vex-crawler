import type { ObjectBuilder } from "../../builders.js";
import { Client } from "../client.js";
import { ViaRequest, ViaRequestBuilder, type ViaParams } from "../via.js";
import type {
  Award,
  Division,
  Event,
  EventTeam,
  Match,
  Ranking,
  Skill,
  Stats,
  Team,
} from "./index.js";

export class EventsClient extends Client {
  public findAll(
    request?: (builder: EventsRequestBuilder) => ObjectBuilder<EventsRequest>,
  ) {
    return this.getAll<Division | Event | EventTeam | Team>(
      "/events",
      request?.(new EventsRequestBuilder()).build().params(),
    );
  }

  public findBySku(
    request: (builder: EventRequestBuilder) => ObjectBuilder<EventRequest>,
  ) {
    const req = request(new EventRequestBuilder()).build();
    return this.getAll<Award | Match | Ranking | Skill | Stats>(
      `/event/${req.sku}`,
      req.params(),
    );
  }
}

class EventRequestBuilder extends ViaRequestBuilder<
  EventRequest,
  EventRequestBuilder
> {
  #sku?: string;

  public sku(value: string) {
    this.#sku = value.toLowerCase();
    return this;
  }

  public override build() {
    return new EventRequest(this);
  }

  public static readonly EventRequest = class extends ViaRequest {
    public readonly sku: string;

    public constructor(builder: EventRequestBuilder) {
      super(builder);
      if (builder.#sku === undefined) {
        throw new Error("Missing required property EventRequest.sku");
      }
      this.sku = builder.#sku;
    }

    public params(): EventParams {
      return super.params();
    }
  };
}

export class EventRequest extends EventRequestBuilder.EventRequest {}

interface EventParams extends ViaParams {}

export class EventsRequestBuilder extends ViaRequestBuilder<
  EventsRequest,
  EventsRequestBuilder
> {
  public override build() {
    return new EventsRequest(this);
  }

  public static readonly EventsRequest = class extends ViaRequest {
    public constructor(builder: EventsRequestBuilder) {
      super(builder);
    }

    public params(): EventsParams {
      return super.params();
    }
  };
}

export class EventsRequest extends EventsRequestBuilder.EventsRequest {}

interface EventsParams extends ViaParams {}
