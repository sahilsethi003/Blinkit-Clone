import { useSelector } from 'react-redux'
import isAdmin from '../utils/isAdmin'
import AccessDenied from '../pages/AccessDenied'

const AdminPermision = ({children}) => {
    const user = useSelector(state => state.user)


  return (
    <>
        {
            isAdmin(user.role) ?  children : <AccessDenied />
        }
    </>
  )
}

export default AdminPermision
