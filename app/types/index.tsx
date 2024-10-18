export type userType = {
  username: string;
  id: string;
} | null;

export type listLabelsType = labelType[] | null;

export type labelType = {
  label: string;
  id: number;
  private: boolean;
};

export type vnListType = vnType[] | null | [];

export type vnType = {
  id: string;
  vn: {
    title: string;
    alttitle: string;
    image: {
      url: string;
    };
  };
};
