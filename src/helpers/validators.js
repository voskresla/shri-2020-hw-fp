/**
 * @file Домашка по FP ч. 1
 * 
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import { any, map,both, equals, allPass, propEq, partial, prop, partialRight, not, filter, compose, length, keys, lte, anyPass, sort, comparator, lt, groupWith, values, complement, head } from "ramda";

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (input) => {
	const validStar = propEq('star', 'red')
	const validSquare = propEq('square', 'green')
	const propEqWhite = partialRight(propEq, ['white'])

	const validTriangle = propEqWhite('triangle')
	const validCircle = propEqWhite('circle')

	const success = allPass([validStar, validSquare, validTriangle, validCircle])

	return success(input)
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (input) => compose(lte(2), length, keys, filter(equals('green')))(input)

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (input) => {

	const ln = color => compose(length, keys, filter(equals(color)))

	return equals(ln('red')(input), ln('blue')(input))
};

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = (input) => {
	const isBlue = partialRight(propEq, ['blue'])
	const isRed = partialRight(propEq, ['red'])
	const isOrange = partialRight(propEq, ['orange'])

	return allPass([isBlue('circle'), isRed('star'), isOrange('square')])(input)
};

// 5. Три фигуры одного любого цвета кроме белого.
export const validateFieldN5 = (input) => compose(
		any(equals(3)),
		map(length),
		groupWith(equals),
		filter(complement(equals('white'))),
		sort(comparator(lt)),
		values
	   )(input)
;

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = (input) => compose(
	both(
		compose(
			both(
				compose(
					equals(2),
					length,
					filter(equals('green'))
				),
				compose(
					equals(1),
					length,
					filter(equals('red'))
				)
			),
			values
		),
		propEq('triangle', 'green')
	)
)(input)

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (input) => {
	return equals(length(values(input)), length(filter(equals('orange'))(values(input))))
};

// 8. Не красная и не белая звезда.
export const validateFieldN8 = ({ star }) => {
	return equals(not(equals('red')(star)), not(equals('white')(star)))
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (input) => {
	return equals(length(values(input)), length(filter(equals('green'))(values(input))))
};

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = (input) => {
	const notWhiteTriangle = input => not(equals('white', input.triangle))
	const notWhiteSquare = input => not(equals('white', input.square))
	const v = input => equals(input.square, input.triangle)

	return allPass([v, notWhiteTriangle, notWhiteSquare])(input)
};
