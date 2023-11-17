import { Skeleton } from "@rneui/themed";
import CustomerSkeleton from "./varieties/CustomerSkeleton";
import OrderSkeleton from "./varieties/OrderSkeleton";
import ChowSkeleton from "./varieties/ChowSkeleton";

interface SkeletonProps {
  type: "CustomerSkeleton" | "OrderSkeleton" | "ChowSkeleton";
  count?: number;
}

export const generateSkeletons = ({ count, type }: SkeletonProps) => {
  const skeletons = Array.from({ length: count || 1 }, (_, index) => (
    <NativeSkeleton key={index} type={type} />
  ));
  return skeletons;
};

const NativeSkeleton = ({ type }: SkeletonProps) => {
  switch (type) {
    case "CustomerSkeleton":
      return <CustomerSkeleton />;

    case "OrderSkeleton":
      return <OrderSkeleton />;

    case "ChowSkeleton":
      return <ChowSkeleton />;

    default:
      return <Skeleton width={300} height={200} animation="wave" />;
  }
};

export default NativeSkeleton;
