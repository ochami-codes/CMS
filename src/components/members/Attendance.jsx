// src/components/members/Attendance.jsx

import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import toast from "react-hot-toast";

import {
  MembersAPI,
  AttendanceAPI,
} from "../../utils/api";

import Card from "../Card";
import Button from "../Button";
import Table from "../Table";
import EmptyState from "../EmptyState";
import Loader from "../Loader";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function Attendance({
  department,
}) {

  const today =
    useMemo(
      () =>
        new Date()
          .toISOString()
          .split("T")[0],
      []
    );

  const [members,
    setMembers] =
    useState([]);

  const [attendance,
    setAttendance] =
    useState({});

  const [notes,
    setNotes] =
    useState({});

  const [monthly,
    setMonthly] =
    useState([]);

  const [yearly,
    setYearly] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [saving,
    setSaving] =
    useState(false);

  const [serviceType,
    setServiceType] =
    useState("Morning");


/* ======================
   FETCH
====================== */

const fetchData =
useCallback(async()=>{

if(!department) return;

try{

setLoading(true);

const [
membersRes,
attendanceRes,
monthRes,
yearRes
]

= await Promise.all([

MembersAPI.fetchAll(
department
),

AttendanceAPI.fetch(
department,
today
),

AttendanceAPI.summary(
department,
"month"
),

AttendanceAPI.summary(
department,
"year"
)

]);


setMembers(
membersRes?.members
?? []
);

setMonthly(
monthRes?.summary
?? []
);

setYearly(
yearRes?.summary
?? []
);


const map={};
const notesMap={};

attendanceRes?.records
?.forEach(r=>{

map[r.member_id]=
r.present;

notesMap[
r.member_id
]=r.notes;

});

setAttendance(map);
setNotes(notesMap);

}catch(err){

toast.error(
"Failed loading attendance"
);

}
finally{
setLoading(false);
}

},[
department,
today
]);


useEffect(()=>{

fetchData();

},[fetchData]);



/* ======================
SAVE
====================== */

const saveAttendance =
async()=>{

try{

setSaving(true);

const records =
members.map(m=>({

member_id:m.id,

department,

date:today,

service_type:
serviceType,

present:
attendance[m.id]
?? false,

notes:
notes[m.id]
?? ""

}));

await AttendanceAPI
.save(records);

toast.success(
"Attendance saved"
);

}
catch{

toast.error(
"Save failed"
);

}
finally{

setSaving(false);

}

};



/* ======================
TABLE DATA
====================== */

const rows =
members.map(m=>({

name:
m.full_name,

present:

<input
type="checkbox"

checked={
attendance[m.id]
?? false
}

onChange={()=>

setAttendance(
prev=>({

...prev,

[m.id]:
!prev[m.id]

})
)

}
/>,


notes:

<input

value={
notes[m.id]
?? ""
}

onChange={(e)=>

setNotes(
prev=>({

...prev,

[m.id]:
e.target.value

})
)

}

/>

}));



if(!department){

return (

<EmptyState
title="Attendance"
message="Select department"
/>

);

}


if(loading){

return (
<Loader
message="Loading attendance..."
/>
);

}



return (

<>

<Card>

<h2>
{department}
Attendance
</h2>

<select

value={serviceType}

onChange={(e)=>
setServiceType(
e.target.value
)
}

>

<option>
Morning
</option>

<option>
Evening
</option>

</select>


<Table

columns={[

{
key:"name",
label:"Member"
},

{
key:"present",
label:"Present"
},

{
key:"notes",
label:"Notes"
}

]}

data={rows}

/>


<Button

onClick={
saveAttendance
}

disabled={
saving
}

>

{saving
? "Saving..."
: "Save Attendance"}

</Button>

</Card>



<Card>

<h3>
Monthly Attendance
</h3>

<ResponsiveContainer
height={220}
>

<BarChart
data={monthly}
>

<XAxis
dataKey="date"
/>

<YAxis/>

<Tooltip/>

<Bar
dataKey=
"presentCount"
/>

</BarChart>

</ResponsiveContainer>

</Card>



<Card>

<h3>
Yearly Attendance
</h3>

<ResponsiveContainer
height={220}
>

<BarChart
data={yearly}
>

<XAxis
dataKey="month"
/>

<YAxis/>

<Tooltip/>

<Bar
dataKey=
"presentCount"
/>

</BarChart>

</ResponsiveContainer>

</Card>

</>

);

}
