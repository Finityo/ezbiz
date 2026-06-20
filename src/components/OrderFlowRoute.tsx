import React, { Suspense, lazy } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { PACKAGE_PRICES } from "@/lib/pricing";

const EnhancedOrderFlow = lazy(() => import("@/pages/EnhancedOrderFlow"));

/** Branded loading state while the wizard chunk downloads. */
const OrderFlowFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background px-4">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
      <p className="text-base font-medium text-foreground">
        Preparing your EZ Biz filing options...
      </p>
    </div>
  </div>
);

/** Recovery UI when the lazy chunk or wizard throws. */
const OrderFlowErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background px-4">
    <div className="max-w-md text-center space-y-5">
      <h1 className="text-2xl font-bold text-foreground">
        We had trouble loading your order flow
      </h1>
      <p className="text-muted-foreground">
        Please return to pricing and choose your package.
      </p>
      <Link
        to="/pricing"
        className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
      >
        Back to Pricing
      </Link>
    </div>
  </div>
);

class OrderFlowErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.error("OrderFlow chunk failed:", error);
  }
  render() {
    if (this.state.hasError) return <OrderFlowErrorFallback />;
    return this.props.children;
  }
}

/**
 * Lightweight pre-route guard. Runs BEFORE the heavy EnhancedOrderFlow chunk
 * loads, so users who hit /order-flow?mode=guided without a valid package
 * get an instant redirect to /pricing instead of a blank screen.
 */
const OrderFlowRoute = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const pkg = searchParams.get("package");
  const isWhiteGlove = mode === "whiteglove";
  const hasValidPackage =
    !!pkg && Object.prototype.hasOwnProperty.call(PACKAGE_PRICES, pkg);
  // Resume / autoPay links carry orderId or applicationId instead of package —
  // hydration happens inside EnhancedOrderFlow. Don't bounce them to /pricing.
  const isResumeLink =
    !!searchParams.get("orderId") ||
    !!searchParams.get("applicationId") ||
    searchParams.get("resume") === "1" ||
    searchParams.get("autoPay") === "1";

  if (!isWhiteGlove && !hasValidPackage && !isResumeLink) {
    return <Navigate to="/pricing" replace />;
  }

  return (
    <OrderFlowErrorBoundary>
      <Suspense fallback={<OrderFlowFallback />}>
        <EnhancedOrderFlow />
      </Suspense>
    </OrderFlowErrorBoundary>
  );
};

export default OrderFlowRoute;
