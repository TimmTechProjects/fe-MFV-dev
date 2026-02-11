export type PlantPrimaryType =
  | "TREE"
  | "SHRUB"
  | "HERBACEOUS"
  | "VINE_CLIMBER"
  | "FERN"
  | "SUCCULENT"
  | "GRASS"
  | "FUNGUS"
  | "AQUATIC";

export type TraitCategory =
  | "BLOOMING_LIFECYCLE"
  | "ENVIRONMENT_GROWTH"
  | "USE_ORIGIN";

export interface Trait {
  id: string;
  name: string;
  slug: string;
  category: TraitCategory;
}

export interface PlantTrait {
  plantId: string;
  traitId: string;
  trait: Trait;
}

export interface Plant {
  id: string;
  botanicalName: string;
  commonName?: string;
  collection: {
    id: string;
    slug: string;
    name?: string;
  } | null;
  collectionId?: string;
  originalCollection?: {
    slug: string;
  };
  slug: string;
  origin: string;
  family: string;
  type:
    | "herb"
    | "tree"
    | "shrub"
    | "flower"
    | "succulent"
    | "cactus"
    | "fern"
    | "bamboo"
    | "grass"
    | "vine"
    | "bulb"
    | "aquatic"
    | "mushroom";
  primaryType?: PlantPrimaryType;
  description: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  isGarden?: boolean;

  user: {
    username: string;
  };

  tags: {
    id: string;
    name: string;
  }[];

  plantTraits?: PlantTrait[];

  images: {
    id: string;
    url: string;
    isMain: boolean;
  }[];
}

export interface EditSuggestion {
  id: string;
  plantId: string;
  suggestedBy: string; // userId
  fields: Partial<Plant>; // only the fields being suggested
  reason?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string; // userId
}
