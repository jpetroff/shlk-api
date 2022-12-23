import styles from './shortlink-slug-input.less'
import _ from 'underscore'
import React from 'react'

export type TextPattern = {
	key: string;
	value: string;
	readOnly?: boolean;
	placeholder?: string;
}

type Props = {
	text: Array<TextPattern | string>;
	onChange: (value: string, type: string) => void;
}

export const ShortlinkSlugInput : React.FC<Props> = (
	{
		text,
		onChange
	} : Props
) => {

	return (
		<div className={styles.wrapperClass}> 
			{text.map((chunk: TextPattern | string, index ) => {
				if (_.isString(chunk)) {
					return (<span key={index} className={`text-filler input-common-style`}>{chunk}</span>)
				} else {
					return (
						<span key={index} className={`input-resizable`}>
							<input 
								className={`input-resizable__real-input input-common-style`}
								value={chunk.value}
								onChange={(event) => {onChange(event.target.value, chunk.key)}}
							/>
							<span className={`input-resizable__width-sizer input-common-style input-resizable__width-sizer_${chunk.value ? 'hide' : 'show'}`}>{chunk.value || chunk.placeholder}</span>
						</span>
					)
				}
			})}
		</div>
	)

}