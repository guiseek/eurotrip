export function query<S extends string>(
  selector: S,
  parent?: Element | ShadowRoot
): ParseSelector<S> | null {
  return (parent ?? document).querySelector(selector)
}

export function queryAll<S extends string>(
  selector: S,
  parent?: Element | ShadowRoot
): NodeListOf<ParseSelector<S>> {
  return (parent ?? document).querySelectorAll(selector)
}
