export type HDOptions =
  | {
      /** The account index to use in the path (`"m/44'/637'/${accountIndex}'/0/0"`). */
      accountIndex?: number | undefined
      /** The address index to use in the path (`"m/44'/637'/0'/0/${addressIndex}"`). */
      addressIndex?: number | undefined
      /** The change index to use in the path (`"m/44'/637'/0'/${changeIndex}/0"`). */
      changeIndex?: number | undefined
      path?: undefined
    }
  | {
      accountIndex?: undefined
      addressIndex?: undefined
      changeIndex?: undefined
      /** The HD path. */
      path: `m/44'/637'/${string}`
    }