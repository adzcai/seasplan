import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Fragment, useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

const equals = (s: any) => (ss: any) => ss.calendarYear === s.calendarYear && ss.term === s.term;

export default function Home({
  semesters, meta, plan
}: any) {
  const [selectedSemesters, setSelectedSemesters] = useState(semesters);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(meta.catalogPrefixes);

  return (
    <main className={"flex min-h-screen flex-col items-center p-24 " + inter.className}>
      <h1>Filter by semester</h1>
      <div className="flex flex-row">
        {semesters.map((s: any) => (
          <button
          key={s}
          className={"flex flex-col items-center justify-center p-4 rounded hover:bg-gray-500" + (
            selectedSemesters.find(equals(s)) ? " bg-blue-300" : " bg-gray-300"
          )}
          onClick={() => {
            if (selectedSemesters.find(equals(s))) {
              setSelectedSemesters(selectedSemesters.filter((ss: any) => !equals(s)(ss)));
            } else {
              setSelectedSemesters([...selectedSemesters, s]);
            }
          }}
          >
            <h2>{s.calendarYear}</h2>
            <h3>{s.term}</h3>
          </button>
        ))}
      </div>
      <h1>Subjects</h1>
      <div className="flex flex-row">
        {meta.catalogPrefixes.map((s: string) => (
          <button
          key={s}
          className={"flex flex-col items-center justify-center p-4 rounded hover:bg-gray-500" + (
            selectedSubjects.includes(s) ? " bg-blue-300" : " bg-gray-300"
          )}
          onClick={() => {
            if (selectedSubjects.includes(s)) {
              setSelectedSubjects(selectedSubjects.filter((ss: string) => ss !== s));
            } else {
              setSelectedSubjects([...selectedSubjects, s]);
            }
          }}
          >
            <h2>{s}</h2>
          </button>
        ))}
      </div>
      <h1>Courses</h1>
      <div className="grid grid-cols-2">
        {plan
        .filter((c: any) => {
          const semesterMatch = c.semesters.find((s: any) => selectedSemesters.find(equals(s)))
          const subjectMatch = selectedSubjects.includes(c.catalogPrefix);
          return semesterMatch && subjectMatch;
        })
        .map((c: any) => (
          <Fragment key={c.id}>
            <h2>{c.catalogNumber}</h2>
            <h3>{c.title}</h3>

              {/* <h3>{c.id}</h3> */}
            {/* <div className="flex flex-col">
              {c.semesters.filter((s: any) => selectedSemesters.find(equals(s))).map((s: any) => (
                <div key={s.calendarYear + s.term} className="flex flex-row">
                  <h3>{s.calendarYear}</h3>
                  <h4>{s.term}</h4>
                </div>
              ))}
            </div> */}
          </Fragment>
        ))}
      </div>
    </main>
  )
}

export async function getServerSideProps() {
  const metaRes = await fetch('https://computingapps.seas.harvard.edu/course-planner/api/metadata');
  const planRes = await fetch('https://computingapps.seas.harvard.edu/course-planner/api/course-instances/multi-year-plan');
  const meta = await metaRes.json();
  const plan = await planRes.json();
  const semesters: any[] = [];
  for (const c of plan) {
    for (const s of c.semesters) {
      if (!semesters.find(equals(s))) {
        const { calendarYear, term } = s;
        semesters.push({ calendarYear, term });
      }
    }
  }

  return {
    props: {
      semesters,
      meta,
      plan
    }
  };
}
