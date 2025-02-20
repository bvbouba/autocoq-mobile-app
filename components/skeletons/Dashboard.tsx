
import { Skeleton } from "moti/skeleton"; 


export default function DashboardSkeletion () {
   
   return( <>
    <Skeleton colorMode="light" height={250} width="100%" radius={2} />
            <Skeleton colorMode="light" height={50} width="80%" radius={2} 
            />
            <Skeleton colorMode="light" height={100} width="100%" radius={2} />
    </>
   )
}