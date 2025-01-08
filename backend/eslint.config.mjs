import teslint from 'typescript-eslint'

export default teslint.config(
  teslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          'selector': 'interface',
          'format': ['StrictPascalCase'],
          'prefix': ['I'],
          'filter': {
            'regex': 'FastifyInstance',
            'match': false
          }
        },
        {
          'selector': 'class',
          'format': ['StrictPascalCase']
        },
        {
          'selector': 'typeAlias',
          'format': ['StrictPascalCase'],
          'prefix': ['T']
        },
        {
          'selector': 'typeParameter',
          'format': ['StrictPascalCase'],
          'prefix': ['T']
        },
        {
          'selector': 'variableLike',
          'format': ['strictCamelCase']
        }
      ]
    }
  },
  {
    ignores: [
      'src/library/mongoose-model.ts'
    ]
  }
)