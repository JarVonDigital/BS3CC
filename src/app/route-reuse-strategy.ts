import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  private storedRoutes = new Map<string, DetachedRouteHandle>();

  /**
   * Decide if this route should be detached and stored
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return !!route.routeConfig && route.routeConfig.path !== undefined;
  }

  /**
   * Store the detached route
   */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    if (route.routeConfig && handle) {
      this.storedRoutes.set(route.routeConfig.path!, handle);
    }
  }

  /**
   * Check if we have a stored route for this path
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!route.routeConfig && this.storedRoutes.has(route.routeConfig.path!);
  }

  /**
   * Get the stored route
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!route.routeConfig) return null;
    return this.storedRoutes.get(route.routeConfig.path!) || null;
  }

  /**
   * Reuse route only if configs match
   */
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
