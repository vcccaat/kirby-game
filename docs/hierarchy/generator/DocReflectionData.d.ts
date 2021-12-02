export interface DocReflectionData {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  originalName: string;
  children?: (ChildrenEntity)[] | null;
  groups?: (GroupsEntity)[] | null;
  sources?: (SourcesEntity)[] | null;
}
export interface FlagsOrComment {
}
export interface ChildrenEntity {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: Flags;
  children?: (ChildrenEntity1)[] | null;
  groups?: (GroupsEntity)[] | null;
  sources?: (SourcesEntity)[] | null;
  extendedTypes?: (TypesEntityOrTypeOrExtendedTypesEntity)[] | null;
  decorators?: (DecoratorsEntity)[] | null;
  typeParameter?: (TypeParameterEntity)[] | null;
  extendedBy?: (TypeOrOverwritesOrInheritedFromOrTypesEntityOrExtendedTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrExtendedByEntityOrImplementationOfOrImplementedTypesEntityOrImplementedByEntityOrDecoratesEntity)[] | null;
  comment?: Comment | null;
  implementedTypes?: (TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrImplementedTypesEntity)[] | null;
  implementedBy?: (TypeOrOverwritesOrInheritedFromOrTypesEntityOrExtendedTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrExtendedByEntityOrImplementationOfOrImplementedTypesEntityOrImplementedByEntityOrDecoratesEntity)[] | null;
  type?: Type | null;
  defaultValue?: string | null;
  decorates?: (TypeOrOverwritesOrInheritedFromOrTypesEntityOrExtendedTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrExtendedByEntityOrImplementationOfOrImplementedTypesEntityOrImplementedByEntityOrDecoratesEntity)[] | null;
  signatures?: (SignaturesEntity)[] | null;
}
export interface Flags {
  isAbstract?: boolean | null;
  isPrivate?: boolean | null;
}
export interface ChildrenEntity1 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: Flags1;
  sources?: (SourcesEntity)[] | null;
  type?: Type1 | null;
  defaultValue?: string | null;
  signatures?: (SignaturesEntity1)[] | null;
  overwrites?: TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity | null;
  getSignature?: (GetSignatureEntity)[] | null;
  inheritedFrom?: TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity1 | null;
  setSignature?: (SetSignatureEntity)[] | null;
  decorators?: (DecoratorsEntity1)[] | null;
  comment?: Comment1 | null;
  implementationOf?: TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity2 | null;
}
export interface Flags1 {
  isProtected?: boolean | null;
  isPublic?: boolean | null;
  isAbstract?: boolean | null;
  isStatic?: boolean | null;
  isPrivate?: boolean | null;
  isReadonly?: boolean | null;
  isExternal?: boolean | null;
  isOptional?: boolean | null;
}
export interface SourcesEntity {
  fileName: string;
  line: number;
  character: number;
}
export interface Type1 {
  type: string;
  declaration?: Declaration | null;
  name?: string | null;
  value?: boolean | null;
  id?: number | null;
  elementType?: TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity3 | null;
  typeArguments?: (TypeArgumentsEntity)[] | null;
  types?: (TypesEntity)[] | null;
  queryType?: TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity4 | null;
}
export interface Declaration {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  indexSignature?: IndexSignature | null;
  signatures?: (SignaturesEntity2)[] | null;
  children?: (ChildrenEntity2)[] | null;
  groups?: (GroupsEntity)[] | null;
}
export interface IndexSignature {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  parameters?: (ParametersEntity)[] | null;
  type: Type2;
}
export interface ParametersEntity {
  id: number;
  name: string;
  kind: number;
  flags: FlagsOrComment;
  type: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity;
}
export interface TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity {
  type: string;
  name: string;
}
export interface Type2 {
  type: string;
  id?: number | null;
  name: string;
  typeArguments?: (TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity5)[] | null;
}
export interface TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity5 {
  type: string;
  id?: number | null;
  name: string;
}
export interface SignaturesEntity2 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  parameters?: (ParametersEntity1)[] | null;
  type: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity;
}
export interface ParametersEntity1 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: Flags2;
  type: Type3;
}
export interface Flags2 {
  isRest?: boolean | null;
}
export interface Type3 {
  type: string;
  types?: (TypesEntity1)[] | null;
  elementType?: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity1 | null;
}
export interface TypesEntity1 {
  type: string;
  value?: null;
  name?: string | null;
}
export interface TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity1 {
  type: string;
  name: string;
}
export interface ChildrenEntity2 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  type: Type4;
  defaultValue?: string | null;
  sources?: (SourcesEntity)[] | null;
}
export interface Type4 {
  type: string;
  value?: string | null;
  name?: string | null;
}
export interface GroupsEntity {
  title: string;
  kind: number;
  children?: (number)[] | null;
}
export interface TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity3 {
  type: string;
  id?: number | null;
  name: string;
}
export interface TypeArgumentsEntity {
  type: string;
  name?: string | null;
  types?: (TypesEntityOrType)[] | null;
  id?: number | null;
  typeArguments?: (TypeOrOverwritesOrInheritedFromOrTypesEntityOrExtendedTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrExtendedByEntityOrImplementationOfOrImplementedTypesEntityOrImplementedByEntityOrDecoratesEntity)[] | null;
  declaration?: Declaration1 | null;
}
export interface TypesEntityOrType {
  type: string;
  name?: string | null;
  elementType?: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity2 | null;
}
export interface TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity2 {
  type: string;
  name: string;
}
export interface TypeOrOverwritesOrInheritedFromOrTypesEntityOrExtendedTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrExtendedByEntityOrImplementationOfOrImplementedTypesEntityOrImplementedByEntityOrDecoratesEntity {
  type: string;
  id: number;
  name: string;
}
export interface Declaration1 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  children?: (ChildrenEntity3)[] | null;
  groups?: (GroupsEntity)[] | null;
  sources?: (SourcesEntity)[] | null;
}
export interface ChildrenEntity3 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  sources?: (SourcesEntity)[] | null;
  type: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity;
}
export interface TypesEntity {
  type: string;
  value?: null;
  id?: number | null;
  name?: string | null;
}
export interface TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity4 {
  type: string;
  id?: number | null;
  name: string;
}
export interface SignaturesEntity1 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: Flags3;
  parameters?: (ParametersEntity2)[] | null;
  type: Type5;
  overwrites?: TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity6 | null;
  inheritedFrom?: TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity7 | null;
  comment?: Comment2 | null;
  typeParameter?: (ParametersEntityOrTypeParameterEntityOrSignaturesEntityOrGetSignatureEntity)[] | null;
  implementationOf?: TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity8 | null;
}
export interface Flags3 {
  isExternal?: boolean | null;
  isPrivate?: boolean | null;
}
export interface ParametersEntity2 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: Flags4;
  type: Type6;
  defaultValue?: string | null;
  comment?: Comment3 | null;
  originalName?: string | null;
}
export interface Flags4 {
  isOptional?: boolean | null;
  isRest?: boolean | null;
  isExternal?: boolean | null;
}
export interface Type6 {
  type: string;
  types?: (TypesEntity2)[] | null;
  id?: number | null;
  name?: string | null;
  elementType?: TypeArgumentsEntityOrElementType | null;
  declaration?: Declaration2 | null;
  typeArguments?: (TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrImplementedTypesEntity)[] | null;
}
export interface TypesEntity2 {
  type: string;
  elementType?: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity3 | null;
  id?: number | null;
  name?: string | null;
  value?: null;
  typeArguments?: (TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity5)[] | null;
}
export interface TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity3 {
  type: string;
  name: string;
}
export interface TypeArgumentsEntityOrElementType {
  type: string;
  id?: number | null;
  typeArguments?: (TypeOrOverwritesOrInheritedFromOrTypesEntityOrExtendedTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrExtendedByEntityOrImplementationOfOrImplementedTypesEntityOrImplementedByEntityOrDecoratesEntity)[] | null;
  name?: string | null;
  types?: (TypesEntityOrType)[] | null;
}
export interface Declaration2 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: Flags5;
  signatures?: (SignaturesEntity3)[] | null;
  children?: (ChildrenEntity4)[] | null;
  groups?: (GroupsEntity)[] | null;
  indexSignature?: IndexSignature1 | null;
}
export interface Flags5 {
  isExternal?: boolean | null;
}
export interface SignaturesEntity3 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: Flags5;
  parameters?: (ParametersEntity3)[] | null;
  type: TypeOrTypeArgumentsEntityOrElementType;
}
export interface ParametersEntity3 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: Flags4;
  type: Type7;
}
export interface Type7 {
  type: string;
  elementType?: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity4 | null;
  id?: number | null;
  name?: string | null;
  types?: (TypesEntity1)[] | null;
}
export interface TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity4 {
  type: string;
  name: string;
}
export interface TypeOrTypeArgumentsEntityOrElementType {
  type: string;
  name?: string | null;
  types?: (TypesEntityOrType)[] | null;
}
export interface ChildrenEntity4 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: Flags6;
  sources?: (SourcesEntity)[] | null;
  type: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity;
}
export interface Flags6 {
  isOptional?: boolean | null;
  isExternal?: boolean | null;
}
export interface IndexSignature1 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: Flags5;
  parameters?: (ParametersEntity4)[] | null;
  type: Type8;
}
export interface ParametersEntity4 {
  id: number;
  name: string;
  kind: number;
  flags: Flags5;
  type: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity;
}
export interface Type8 {
  type: string;
  declaration?: Declaration3 | null;
  name?: string | null;
}
export interface Declaration3 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  sources?: (SourcesEntity)[] | null;
  signatures?: (SignaturesEntityOrSetSignatureEntity)[] | null;
}
export interface SignaturesEntityOrSetSignatureEntity {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  parameters?: (ParametersEntityOrTypeParameterEntityOrSignaturesEntityOrGetSignatureEntity1)[] | null;
  type: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity;
}
export interface ParametersEntityOrTypeParameterEntityOrSignaturesEntityOrGetSignatureEntity1 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  type: TypeOrOverwritesOrInheritedFromOrTypesEntityOrExtendedTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrExtendedByEntityOrImplementationOfOrImplementedTypesEntityOrImplementedByEntityOrDecoratesEntity;
}
export interface TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrImplementedTypesEntity {
  type: string;
  id?: number | null;
  name: string;
  typeArguments?: (TypeOrOverwritesOrInheritedFromOrTypesEntityOrExtendedTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrExtendedByEntityOrImplementationOfOrImplementedTypesEntityOrImplementedByEntityOrDecoratesEntity)[] | null;
}
export interface Comment3 {
  shortText?: string | null;
}
export interface Type5 {
  type: string;
  elementType?: TypeOrElementType | null;
  id?: number | null;
  name?: string | null;
  declaration?: Declaration4 | null;
  types?: (TypesEntity3)[] | null;
  typeArguments?: (TypeArgumentsEntityOrElementType1)[] | null;
}
export interface TypeOrElementType {
  type: string;
  types?: (TypesEntityOrType1)[] | null;
  id?: number | null;
  name?: string | null;
}
export interface TypesEntityOrType1 {
  type: string;
  elementType?: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity4 | null;
  id?: number | null;
  name?: string | null;
}
export interface Declaration4 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  children?: (ChildrenEntity5)[] | null;
  groups?: (GroupsEntity)[] | null;
  signatures?: (SignaturesEntityOrSetSignatureEntity1)[] | null;
  indexSignature?: IndexSignature2 | null;
}
export interface ChildrenEntity5 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  type: Type9;
  defaultValue: string;
}
export interface Type9 {
  type: string;
  id?: number | null;
  name?: string | null;
  declaration?: Declaration5 | null;
  typeArguments?: (TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity)[] | null;
}
export interface Declaration5 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  children?: (ChildrenEntity6)[] | null;
  groups?: (GroupsEntity)[] | null;
  signatures?: (SignaturesEntity4)[] | null;
}
export interface ChildrenEntity6 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  type: Type10;
  defaultValue: string;
}
export interface Type10 {
  type: string;
  declaration?: Declaration6 | null;
  name?: string | null;
}
export interface Declaration6 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  signatures?: (SignaturesEntityOrSetSignatureEntity2)[] | null;
  children?: (ParametersEntityOrChildrenEntity)[] | null;
  groups?: (GroupsEntity)[] | null;
}
export interface SignaturesEntityOrSetSignatureEntity2 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  parameters?: (GetSignatureEntityOrParametersEntityOrSignaturesEntity)[] | null;
  type: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity;
}
export interface GetSignatureEntityOrParametersEntityOrSignaturesEntity {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  type: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity;
}
export interface ParametersEntityOrChildrenEntity {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  type: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity;
  defaultValue: string;
}
export interface SignaturesEntity4 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  parameters?: (ParametersEntity5)[] | null;
  type: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity;
}
export interface ParametersEntity5 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: Flags2;
  type: Type11;
}
export interface Type11 {
  type: string;
  declaration?: Declaration7 | null;
  name?: string | null;
  elementType?: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity5 | null;
}
export interface Declaration7 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  signatures?: (SignaturesEntityOrSetSignatureEntity2)[] | null;
}
export interface TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity5 {
  type: string;
  name: string;
}
export interface SignaturesEntityOrSetSignatureEntity1 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  parameters?: (ParametersEntityOrGetSignatureEntity)[] | null;
  type: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity;
}
export interface ParametersEntityOrGetSignatureEntity {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  type: TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity5;
}
export interface IndexSignature2 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  parameters?: (ParametersEntity)[] | null;
  type: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity;
}
export interface TypesEntity3 {
  type: string;
  id?: number | null;
  name?: string | null;
  typeArguments?: (TypeOrTypeArgumentsEntityOrExtendedTypesEntityOrElementTypeOrTypesEntityOrImplementedTypesEntity)[] | null;
  queryType?: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity6 | null;
  value?: null;
}
export interface TypeOrTypeArgumentsEntityOrExtendedTypesEntityOrElementTypeOrTypesEntityOrImplementedTypesEntity {
  type: string;
  id: number;
  typeArguments?: (TypeOrOverwritesOrInheritedFromOrTypesEntityOrExtendedTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrExtendedByEntityOrImplementationOfOrImplementedTypesEntityOrImplementedByEntityOrDecoratesEntity)[] | null;
  name: string;
}
export interface TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity6 {
  type: string;
  name: string;
}
export interface TypeArgumentsEntityOrElementType1 {
  type: string;
  id?: number | null;
  typeArguments?: (TypeOrOverwritesOrInheritedFromOrTypesEntityOrExtendedTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrExtendedByEntityOrImplementationOfOrImplementedTypesEntityOrImplementedByEntityOrDecoratesEntity)[] | null;
  name?: string | null;
  types?: (TypesEntityOrType)[] | null;
}
export interface TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity6 {
  type: string;
  id?: number | null;
  name: string;
}
export interface TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity7 {
  type: string;
  id?: number | null;
  name: string;
}
export interface Comment2 {
  shortText?: string | null;
  tags?: (TagsEntity)[] | null;
  returns?: string | null;
  text?: string | null;
}
export interface TagsEntity {
  tag: string;
  text: string;
}
export interface ParametersEntityOrTypeParameterEntityOrSignaturesEntityOrGetSignatureEntity {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  type: TypeOrTypeArgumentsEntityOrExtendedTypesEntityOrElementTypeOrTypesEntityOrImplementedTypesEntity;
}
export interface TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity8 {
  type: string;
  id?: number | null;
  name: string;
}
export interface TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity {
  type: string;
  id?: number | null;
  name: string;
}
export interface GetSignatureEntity {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  type: Type12;
  overwrites?: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity7 | null;
  inheritedFrom?: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity8 | null;
  comment?: Comment4 | null;
  implementationOf?: TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity9 | null;
}
export interface Type12 {
  type: string;
  types?: (TypesEntity4)[] | null;
  name?: string | null;
  declaration?: DeclarationOrTypeParameterEntity | null;
  id?: number | null;
  typeArguments?: (TypeArgumentsEntityOrElementType1)[] | null;
  elementType?: TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity10 | null;
}
export interface TypesEntity4 {
  type: string;
  value?: null;
  id?: number | null;
  name?: string | null;
  types?: (TypesEntity5)[] | null;
  typeArguments?: (TypeOrTypeArgumentsEntityOrExtendedTypesEntityOrElementTypeOrTypesEntityOrImplementedTypesEntity)[] | null;
  elementType?: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity2 | null;
}
export interface TypesEntity5 {
  type: string;
  id: number;
  typeArguments?: (TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity5)[] | null;
  name: string;
}
export interface DeclarationOrTypeParameterEntity {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
}
export interface TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity10 {
  type: string;
  id?: number | null;
  name: string;
}
export interface TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity7 {
  type: string;
  name: string;
}
export interface TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity8 {
  type: string;
  name: string;
}
export interface Comment4 {
  shortText: string;
  returns?: string | null;
  tags?: (TagsEntity)[] | null;
}
export interface TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity9 {
  type: string;
  id?: number | null;
  name: string;
}
export interface TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity1 {
  type: string;
  id?: number | null;
  name: string;
}
export interface SetSignatureEntity {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  comment?: Comment5 | null;
  parameters?: (ParametersEntity6)[] | null;
  type: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity;
  inheritedFrom?: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity9 | null;
  overwrites?: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity10 | null;
  implementationOf?: TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity11 | null;
}
export interface Comment5 {
  shortText: string;
  returns?: string | null;
}
export interface ParametersEntity6 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  type: Type13;
  comment?: Comment6 | null;
}
export interface Type13 {
  type: string;
  types?: (TypesEntity)[] | null;
  id?: number | null;
  typeArguments?: (TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrImplementedTypesEntity)[] | null;
  name?: string | null;
}
export interface Comment6 {
  shortText: string;
}
export interface TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity9 {
  type: string;
  name: string;
}
export interface TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity10 {
  type: string;
  name: string;
}
export interface TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity11 {
  type: string;
  id?: number | null;
  name: string;
}
export interface DecoratorsEntity1 {
  name: string;
  type: TypeOrOverwritesOrInheritedFromOrTypesEntityOrExtendedTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrExtendedByEntityOrImplementationOfOrImplementedTypesEntityOrImplementedByEntityOrDecoratesEntity;
}
export interface Comment1 {
  tags?: (TagsEntity1)[] | null;
  shortText?: string | null;
}
export interface TagsEntity1 {
  tag: string;
  text: string;
  param?: string | null;
}
export interface TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity2 {
  type: string;
  id?: number | null;
  name: string;
}
export interface TypesEntityOrTypeOrExtendedTypesEntity {
  type: string;
  id?: number | null;
  name: string;
  typeArguments?: (TypeOrTypeArgumentsEntityOrExtendedTypesEntityOrElementTypeOrTypesEntityOrImplementedTypesEntity)[] | null;
}
export interface DecoratorsEntity {
  name: string;
  type: TypeOrOverwritesOrInheritedFromOrTypesEntityOrExtendedTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrExtendedByEntityOrImplementationOfOrImplementedTypesEntityOrImplementedByEntityOrDecoratesEntity;
  arguments: Arguments;
}
export interface Arguments {
  serializationName: string;
}
export interface TypeParameterEntity {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  type?: TypeOrTypeArgumentsEntityOrExtendedTypesEntityOrElementTypeOrTypesEntityOrImplementedTypesEntity1 | null;
}
export interface TypeOrTypeArgumentsEntityOrExtendedTypesEntityOrElementTypeOrTypesEntityOrImplementedTypesEntity1 {
  type: string;
  id: number;
  typeArguments?: (TypeOrOverwritesOrInheritedFromOrTypesEntityOrExtendedTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrExtendedByEntityOrImplementationOfOrImplementedTypesEntityOrImplementedByEntityOrDecoratesEntity)[] | null;
  name: string;
}
export interface Comment {
  shortText: string;
  text?: string | null;
  tags?: (TagsEntity)[] | null;
}
export interface Type {
  type: string;
  declaration?: Declaration8 | null;
  elements?: (TypeOrExtendedTypesEntityOrElementsEntity)[] | null;
  types?: (TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity)[] | null;
  indexType?: IndexType | null;
  objectType?: TypeOrTargetOrObjectType | null;
  id?: number | null;
  name?: string | null;
}
export interface Declaration8 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  sources?: (SourcesEntity)[] | null;
  signatures?: (SignaturesEntity5)[] | null;
  indexSignature?: IndexSignature3 | null;
  children?: (ChildrenEntity7)[] | null;
  groups?: (GroupsEntity)[] | null;
}
export interface SignaturesEntity5 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  parameters?: (ParametersEntity7)[] | null;
  type: TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrOverwritesOrInheritedFromOrImplementationOfOrImplementedTypesEntity5;
}
export interface ParametersEntity7 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: Flags7;
  type: TypesEntityOrType1;
}
export interface Flags7 {
  isOptional?: boolean | null;
  isRest?: boolean | null;
}
export interface IndexSignature3 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  parameters?: (ParametersEntity)[] | null;
  type: TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrImplementedTypesEntity;
}
export interface ChildrenEntity7 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  type: Type14;
  defaultValue: string;
}
export interface Type14 {
  type: string;
  value: string;
}
export interface TypeOrExtendedTypesEntityOrElementsEntity {
  type: string;
  id: number;
  typeArguments?: (TypeOrTypeArgumentsEntityOrExtendedTypesEntityOrElementTypeOrTypesEntityOrImplementedTypesEntity)[] | null;
  name: string;
}
export interface IndexType {
  type: string;
  operator: string;
  target: TypeOrTargetOrObjectType1;
}
export interface TypeOrTargetOrObjectType1 {
  type: string;
  queryType: TypeOrOverwritesOrInheritedFromOrTypesEntityOrExtendedTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrExtendedByEntityOrImplementationOfOrImplementedTypesEntityOrImplementedByEntityOrDecoratesEntity;
}
export interface TypeOrTargetOrObjectType {
  type: string;
  queryType: TypeOrOverwritesOrInheritedFromOrTypesEntityOrExtendedTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrExtendedByEntityOrImplementationOfOrImplementedTypesEntityOrImplementedByEntityOrDecoratesEntity;
}
export interface SignaturesEntity {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  comment?: Comment7 | null;
  parameters?: (ParametersEntity8)[] | null;
  type: Type15;
}
export interface Comment7 {
  shortText: string;
  text?: string | null;
  returns?: string | null;
}
export interface ParametersEntity8 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: Flags7;
  comment?: FlagsOrComment1 | null;
  type: Type16;
}
export interface FlagsOrComment1 {
}
export interface Type16 {
  type: string;
  name?: string | null;
  declaration?: Declaration9 | null;
  id?: number | null;
  typeArguments?: (TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrImplementedTypesEntity)[] | null;
  elementType?: TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity11 | null;
}
export interface Declaration9 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  children?: (ChildrenEntity8)[] | null;
  groups?: (GroupsEntity)[] | null;
}
export interface ChildrenEntity8 {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: FlagsOrComment;
  sources?: (SourcesEntity)[] | null;
  type: TypeOrOverwritesOrInheritedFromOrTypesEntityOrExtendedTypesEntityOrElementTypeOrTypeArgumentsEntityOrQueryTypeOrExtendedByEntityOrImplementationOfOrImplementedTypesEntityOrImplementedByEntityOrDecoratesEntity;
}
export interface TypeOrElementTypeOrOverwritesOrInheritedFromOrTypesEntityOrTypeArgumentsEntityOrQueryTypeOrImplementationOfOrExtendedTypesEntityOrImplementedTypesEntity11 {
  type: string;
  name: string;
}
export interface Type15 {
  type: string;
  declaration?: Declaration7 | null;
  name?: string | null;
  id?: number | null;
  typeArguments?: (TypeOrTypesEntityOrElementTypeOrTypeArgumentsEntityOrImplementedTypesEntity)[] | null;
}
