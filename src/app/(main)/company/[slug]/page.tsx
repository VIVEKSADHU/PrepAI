import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore"
import { notFound } from "next/navigation"

import { CompanyClientPage, type Experience } from "./client-page"
import { db } from "@/lib/firebase.client"

async function getCompanyData(companyName: string) {
  const companyRef = doc(db, "companies", companyName)
  const companySnap = await getDoc(companyRef)

  if (!companySnap.exists()) {
    return null
  }

  const experiencesQuery = query(
    collection(db, "experiences"),
    where("company", "==", companyName),
    orderBy("createdAt", "desc")
  )

  const experiencesSnapshot = await getDocs(experiencesQuery)
  const experiences = experiencesSnapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      name: data.name,
      college: data.college,
      branch: data.branch,
      cgpa: data.cgpa,
      role: data.role,
      year: data.year,
      round1: data.round1,
      round2: data.round2,
      round3: data.round3,
      createdAt: data.createdAt?.toDate().toLocaleDateString() || "",
    }
  }) as Experience[]

  const companyData = companySnap.data()
  // Ensure logoURL is present
  if (!companyData.logoURL) {
    const { slugify } = await import("@/lib/utils");
    companyData.logoURL = `https://avatar.vercel.sh/${slugify(companyData.name)}.png?size=96`
  }


  return {
    company: companyData,
    experiences,
  }
}

export default async function CompanyPage({
  params,
}: {
  params: { slug: string }
}) {
  const companyName = decodeURIComponent(params.slug)
  const data = await getCompanyData(companyName)

  if (!data) {
    notFound()
  }

  const { company, experiences } = data

  return <CompanyClientPage company={company} experiences={experiences} />
}
