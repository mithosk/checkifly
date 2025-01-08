import { Model, Document, Types } from 'mongoose'

export interface IMongooseModel<T>
	extends Model<
		T,
		{},
		{},
		{},
		Document<unknown, {}, T> &
			T & {
				_id: Types.ObjectId
			} & {
				__v: number
			},
		any
	> {}
