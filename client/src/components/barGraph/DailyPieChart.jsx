import React, { useContext } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import mealsForOneDate from '../../context/mealsForOneDate'
import profileInfoContext from '../../context/profileInfo'
import userFriendlyNutrientNames from '../../utilities/userFriendlyNutrientNames'
import unitNutrients from '../../utilities/measurmentUnitNutrients'

const COLORS = ['#EA5F3A', '#F79285', '#FBC46C']

function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        const { name, value, unit } = payload[0].payload
        return (
            <div style={{
                background: 'white',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: '0.85rem'
            }}>
                <p style={{margin: 0, fontWeight: 600}}>{name}</p>
                <p style={{margin: 0}}>{Math.round(value * 100) / 100}{unit}</p>
            </div>
        )
    }
    return null
}

export default function DailyPieChart() {
    const { currentDay } = useContext(mealsForOneDate)
    const { profileInfo } = useContext(profileInfoContext)

    if (!currentDay || !profileInfo.chosenNutrients || currentDay.meals.length < 2) return null

    const data = profileInfo.chosenNutrients
        .map((n, i) => {
            const total = currentDay.totalNutrients?.find(t => t.name === n.name)
            return {
                name: userFriendlyNutrientNames[n.name],
                value: total?.amount || 0,
                unit: unitNutrients[n.name] || '',
            }
        })
        .filter(d => d.value > 0)

    if (data.length === 0) return null

    return (
        <div style={{marginTop: 32, textAlign: 'center'}}>
            <h3 style={{marginBottom: 8}}>Daily totals</h3>
            <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value, unit }) => `${Math.round(value)}${unit}`}
                        labelLine={true}
                    >
                        {data.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
