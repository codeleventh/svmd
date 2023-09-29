import '../css/error.css'

import React from 'react'
import {
	Card as MantineCard,
	Center,
	Group,
	List,
	ListItem,
	ScrollArea,
	Space,
	Title,
	useMantineTheme
} from '@mantine/core'
import {AlertCircle, AlertTriangle} from 'tabler-icons-react'

interface IProps {
    errors: string[],
    warnings?: string[],
    stackTrace?: string
}

export const ErrorTemplate: React.FC<IProps> = (props: IProps) => {
	const {errors, warnings, stackTrace} = props
	const theme = useMantineTheme()

	return <div className={'error-wrapper'}>
		<Center p="xl">
			<MantineCard shadow="md">
				<Center><Title order={3}><AlertTriangle style={{verticalAlign: 'middle'}}/> ️Ошибка</Title></Center>
				<Space h='sm'/>
				<Group>
					<List icon={<AlertCircle color={theme.colors.red[5]} style={{verticalAlign: 'middle'}}/>}>
						{errors.map((err, i) => <ListItem key={i}>{err}</ListItem>)}
					</List>
				</Group>
				{warnings && <>
					<Space h='sm'/>
					<Group>
						<List icon={<AlertCircle color={theme.colors.yellow[5]} style={{verticalAlign: 'middle'}}/>}>
							{warnings?.map((warn, i) => <ListItem key={i}>{warn}</ListItem>)}
						</List>
					</Group>
				</>
				}
				{console.log(warnings)}
				{stackTrace && <>
					<Space h='sm'/>
					<Group>
						<ScrollArea
							type='always'
							style={{height: 480}}
							className='error-stack'>{stackTrace}
						</ScrollArea>
					</Group>
				</>}
			</MantineCard>
		</Center>
	</div>
}