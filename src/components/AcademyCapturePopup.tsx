import MonthlyCoachingPopup from './MonthlyCoachingPopup'

export default function AcademyCapturePopup(props: {
  completed: boolean
  suppressed: boolean
  onVisibilityChange: (visible: boolean) => void
}) {
  return <MonthlyCoachingPopup source="academy" {...props} />
}
