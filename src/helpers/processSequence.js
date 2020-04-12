/**
 * @file Домашка по FP ч. 2
 * 
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 * 
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 * 
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import * as R from "ramda";

const api = new Api();

const gt2lt10 = R.compose(
	R.both(
		R.gt(10),
		R.lt(2)
	),
	R.length
)

// Number вернет NaN если это не число, но тут все сработает в false, поэтому отдельно проверять не будем.
// Хотя, сомнений хватает. Но, слабоумие и отвага!
const num0gte = R.compose(
	R.lte(0),
	Number
)

const isValid = R.allPass([
	gt2lt10,
	num0gte
])

const validate = R.either(isValid, () => { throw new Error('ValidationError') })
const round = R.compose(Math.round, Number)
const pow = R.partialRight(Math.pow,[2])

const makeQuery = value => ({
	number: value,
	from: 10,
	to: 2
})

const get1 = R.pipe(
	round,
	makeQuery,
	api.get('https://api.tech/numbers/base')
)

const get2 = R.pipe(
	api.get('https://animals.tech')
)

const processSequence = async ({value, writeLog, handleSuccess, handleError}) => {
	
	writeLog(value);

	try {
		validate(value)
		
		R.pipeWith(R.andThen, [
			get1,
			R.prop('result'),
			R.tap(writeLog),
			value => value.length,
			R.tap(writeLog),
			pow,
			R.tap(writeLog),
			value => value % 3,
			R.tap(writeLog),
			get2,
			R.prop('result'),
			handleSuccess
		])(value)

	} catch (e) {
		handleError(e.message)
	}
}

export default processSequence;
