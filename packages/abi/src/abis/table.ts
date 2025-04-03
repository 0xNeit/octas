export const TABLE_ABI = {
  address: '0x1',
  name: 'table',
  friends: ['0x1::table_with_length', '0x1::storage_slots_allocator'],
  exposed_functions: [
    {
      name: 'contains',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: ['copy', 'drop'],
        },
        {
          constraints: [],
        },
      ],
      params: ['&0x1::table::Table<T0, T1>', 'T0'],
      return: ['bool'],
    },
    {
      name: 'new',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: ['copy', 'drop'],
        },
        {
          constraints: ['store'],
        },
      ],
      params: [],
      return: ['0x1::table::Table<T0, T1>'],
    },
    {
      name: 'borrow',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: ['copy', 'drop'],
        },
        {
          constraints: [],
        },
      ],
      params: ['&0x1::table::Table<T0, T1>', 'T0'],
      return: ['&T1'],
    },
    {
      name: 'borrow_mut',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: ['copy', 'drop'],
        },
        {
          constraints: [],
        },
      ],
      params: ['&mut 0x1::table::Table<T0, T1>', 'T0'],
      return: ['&mut T1'],
    },
    {
      name: 'remove',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: ['copy', 'drop'],
        },
        {
          constraints: [],
        },
      ],
      params: ['&mut 0x1::table::Table<T0, T1>', 'T0'],
      return: ['T1'],
    },
    {
      name: 'add',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: ['copy', 'drop'],
        },
        {
          constraints: [],
        },
      ],
      params: ['&mut 0x1::table::Table<T0, T1>', 'T0', 'T1'],
      return: [],
    },
    {
      name: 'borrow_with_default',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: ['copy', 'drop'],
        },
        {
          constraints: [],
        },
      ],
      params: ['&0x1::table::Table<T0, T1>', 'T0', '&T1'],
      return: ['&T1'],
    },
    {
      name: 'borrow_mut_with_default',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: ['copy', 'drop'],
        },
        {
          constraints: ['drop'],
        },
      ],
      params: ['&mut 0x1::table::Table<T0, T1>', 'T0', 'T1'],
      return: ['&mut T1'],
    },
    {
      name: 'destroy_known_empty_unsafe',
      visibility: 'friend',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: ['copy', 'drop'],
        },
        {
          constraints: [],
        },
      ],
      params: ['0x1::table::Table<T0, T1>'],
      return: [],
    },
    {
      name: 'upsert',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: ['copy', 'drop'],
        },
        {
          constraints: ['drop'],
        },
      ],
      params: ['&mut 0x1::table::Table<T0, T1>', 'T0', 'T1'],
      return: [],
    },
  ],
  structs: [
    {
      name: 'Box',
      is_native: false,
      is_event: false,
      abilities: ['drop', 'store', 'key'],
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      fields: [
        {
          name: 'val',
          type: 'T0',
        },
      ],
    },
    {
      name: 'Table',
      is_native: false,
      is_event: false,
      abilities: ['store'],
      generic_type_params: [
        {
          constraints: ['copy', 'drop'],
        },
        {
          constraints: [],
        },
      ],
      fields: [
        {
          name: 'handle',
          type: 'address',
        },
      ],
    },
  ],
} as const;
